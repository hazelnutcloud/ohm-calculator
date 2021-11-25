<script>
    export let label;
    export let value;
    export let buttonText;
    export let handleClick;
</script>

<div class="container">
    <label for={label}>{label}</label>
    <div class="wrapper">
        <input type="number" placeholder="0" bind:value id={label} />
        <button on:click={handleClick}>{buttonText}</button>
    </div>
</div>

<style>
    .container {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    label {
        display: inline;
    }

    button {
        width: 6rem;
        display: block;
    }
    .wrapper {
      display: flex;
      flex-wrap: nowrap;
    }
    @media (max-width: 640px) {
    input {
      width: 100%;
    }
    label {
      text-align: left;
    }
    .container {
      flex-direction: column;
    }
  }

</style>
