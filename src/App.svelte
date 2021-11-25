<script>
  import { onMount } from "svelte";
  import Input from "./components/Input.svelte";
  import { query, setClient } from "svelte-apollo";
  import { forks } from "./forks";
  import { createApolloClient } from "./helpers";
  import Slider from "./components/Slider.svelte";
  import ResultCard from "./components/ResultCard.svelte";
  import Tooltip from "./components/Tooltip.svelte";

  let userAddress = "";
  let selected_fork = forks[0];
  let results;

  $: {
    let client = createApolloClient(selected_fork.graphUri);
    setClient(client);
    results = query(selected_fork.query, {
      variables: { userAddress: userAddress.toLowerCase() },
    });
  }
  $: results.refetch({ userAddress: userAddress.toLowerCase() });
  $: price = $results.data
    ? selected_fork.name === "HEC"
      ? $results.data.protocolMetrics[0].hecPrice
      : $results.data.protocolMetrics[0].ohmPrice
    : 0;
  $: rebase = $results.data
    ? selected_fork.name === "HEC"
      ? $results.data.rebases[0].percentage
      : $results.data.rebases[0].percentage * 100
    : 0;
  let ethereum;

  onMount(() => {
    ethereum = window.ethereum;
  });

  async function connectMetamask() {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    userAddress = accounts[0];
  }

  const handleClick = (v) => (_) => {
    switch (v) {
      case "stakedAmount":
        stakedAmount = $results.data.ohmie
          ? $results.data.ohmie.lastBalance.sohmBalance
          : 0;
        break;
      case "rebaseRate":
        rebaseRate = rebase;
        break;
      case "purchasePrice":
        purchasePrice = price;
        break;
      case "finalPrice":
        finalPrice = price;
        break;
      case "bestBond":
        bestBond = $results.data.bondDiscounts
          ? Math.max(
              ...Object.values($results.data.bondDiscounts[0])
                .slice(1)
                .filter((n) => n < 50)
            )
          : 0;
    }
  };

  let days = [1];
  $: runwayAvailable = $results.data
    ? parseInt($results.data.protocolMetrics[0].runwayCurrent)
    : 0;
  $: sliderColor =
    days[0] > runwayAvailable + 1
      ? "#ffe047"
      : profits < 0
      ? "#eb4034"
      : "#17cf66";

  let stakedAmount = 0;
  let rebaseRate = 0;
  let purchasePrice = 0;
  let finalPrice = 0;

  $: yieldPercent = Math.pow(1 + rebaseRate / 100, days[0] * 3);
  $: initialInvestment = stakedAmount * purchasePrice;
  $: finalStaked = stakedAmount * yieldPercent;
  $: totalReturns = finalStaked * finalPrice;
  $: roi = totalReturns / initialInvestment;
  $: profits = totalReturns - initialInvestment;
  $: minimumDays = Math.ceil(
    Math.log(initialInvestment / (stakedAmount * finalPrice)) /
      Math.log(1 + rebaseRate / 100) /
      3
  );
  $: minimumPrice =
    initialInvestment /
    (Math.pow(1 + rebaseRate / 100, 3 * runwayAvailable) * stakedAmount);
  $: safetyRatio = (1 - minimumPrice / price) * 100;
  $: bestBond = 0;
  $: stake44return = rebaseRate
    ? (stake44(1, 15) / 15 - 1) * 100 + bestBond
    : 0;
  $: stake33return = (Math.pow(1 + rebaseRate / 100, 15) - 1) * 100;
  $: ratio33to44 = (stake33return / stake44return) * 100;
  $: dilution = ratio33to44 > 100 ? 100 : ratio33to44;

  function stake44(bondRelease, times) {
    let mul = 1 + rebaseRate / 100;
    if (times == 1) {
      return mul * bondRelease;
    }
    return mul * (stake44(bondRelease, times - 1) + bondRelease);
  }
</script>

<main>
  <h1>
    <select bind:value={selected_fork}>
      {#each forks as fork}
        <option value={fork}>{fork.name}</option>
      {/each}
    </select> Calculator
  </h1>
  <p class="subtitle">Calculate your returns</p>

  <label for="user-address"
    >wallet address:
    <span class="address">
      <input
        id="user-address"
        type="text"
        bind:value={userAddress}
        placeholder="0x..."
      />
      {#if ethereum}
        <button on:click={connectMetamask}>connect to metamask</button>
      {/if}
    </span>
  </label>

  {#if $results.loading}
    <h2>Loading...</h2>
  {:else if $results.error}
    <h2>Error: {$results.error.message}</h2>
  {:else}
    <div class="cards-wrapper">
      <div>
        <h2>{selected_fork.name} price</h2>
        {parseFloat(price).toFixed(2).toLocaleString()}
      </div>
      <div>
        <h2>Current rebase rate</h2>
        {parseFloat(rebase).toFixed(2)}%
      </div>
      <div>
        <h2>Your s{selected_fork.name} balance</h2>
        {$results.data.ohmie
          ? parseFloat($results.data.ohmie.lastBalance.sohmBalance)
              .toFixed(2)
              .toLocaleString()
          : 0.0}
      </div>
    </div>
  {/if}

  <div class="input-container">
    <Input
      label="s{selected_fork.name} amount"
      bind:value={stakedAmount}
      buttonText="MAX"
      handleClick={handleClick("stakedAmount")}
    />
    <Input
      label="Rebase rate (%)"
      bind:value={rebaseRate}
      buttonText="CURRENT"
      handleClick={handleClick("rebaseRate")}
    />
    <Input
      label="Price of {selected_fork.name} at purchase ($)"
      bind:value={purchasePrice}
      buttonText="CURRENT"
      handleClick={handleClick("purchasePrice")}
    />
    <Input
      label="Final market price of {selected_fork.name} ($)"
      bind:value={finalPrice}
      buttonText="CURRENT"
      handleClick={handleClick("finalPrice")}
    />
    <Input
      label="Best bond discount"
      bind:value={bestBond}
      buttonText="CURRENT"
      handleClick={handleClick("bestBond")}
    />
  </div>

  <Slider bind:value={days} {results} {runwayAvailable} {sliderColor} />

  <div class="result-cards-container">
    <ResultCard label="Estimated ROI" value="{roi.toFixed(2)}x" />
    <ResultCard
      label="Estimated profits"
      value="${profits.toFixed(2).toLocaleString()}"
    />
    <ResultCard
      label="Estimated total returns"
      value="${totalReturns.toFixed(2).toLocaleString()}"
    />
    {#if minimumDays > 0}
      <ResultCard label="Minimum days to break even" value={minimumDays} />
    {/if}
    <Tooltip
      text="If {selected_fork.name} were to drop below this price, you would be at a loss given the runway available"
      ><ResultCard
        label="Minimum price to break even"
        value=${minimumPrice.toFixed(2)}
      /></Tooltip
    >
    <Tooltip
      text="How far away the current price is from the minimum price to break even (the closer to 100%, the better)"
    >
      <ResultCard
        label="Safety cushion from current price"
        value="{safetyRatio.toFixed(2)}%"
      />
    </Tooltip>
    <Tooltip text="ROI for staking after 5 days">
      <ResultCard
        label="5 days (3,3) ROI"
        value="{stake33return.toFixed(2)}%"
      />
    </Tooltip>
    <Tooltip text="ROI for bonding and staking rewards before every rebase">
      <ResultCard
        label="5 days (4,4) ROI"
        value="{stake44return.toFixed(2)}%"
      />
    </Tooltip>
    <Tooltip
      text="percentage of your market cap captured after 5 days if you were to only stake due to dilution"
    >
      <ResultCard
        label="5 days (3,3) market cap growth"
        value="{dilution.toFixed(2)}%"
      />
    </Tooltip>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
    max-width: 600px;
  }

  .cards-wrapper {
    display: flex;
    justify-content: center;
    column-gap: 2rem;
    padding: 4rem;
  }

  select {
    border: none;
    background-color: transparent;
    font-weight: inherit;
    color: inherit;
  }

  .input-container {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    padding-top: 2rem;
  }

  .result-cards-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: 32px;
  }

  @media (min-width: 640px) {
    main {
      max-width: 800px;
    }
  }

  @media (max-width: 400px) {
    .cards-wrapper {
      flex-direction: column;
      column-gap: 0;
      padding: 0;
    }
  }
</style>
