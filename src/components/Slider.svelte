<script>
  import RangeSlider from "svelte-range-slider-pips";
  export let value;
  export let results;
  export let runwayAvailable;
  export let sliderColor;
</script>

<div
  style="--range-handle-focus: {sliderColor}; --range-slider: {sliderColor}; display: contents"
>
  <label id="days-label" for="days-slider"
    ><input
      type="number"
      bind:value={value[0]}
      style="width: 4rem; border: none"
    />
    days</label
  >

  <span style="font-size: 0.8rem">
    <RangeSlider
      bind:values={value}
      id="days-slider"
      min={1}
      max={365}
      float
      step={1}
      pips={!!$results.data}
      pipstep={runwayAvailable}
      formatter={(v) => v > runwayAvailable + 1 ? '' : `runway available\n${v} days`}
      handleFormatter={(v) => v}
      start={false}
      end={false}
      rest="label"
    />
  </span>
</div>

<style>
  #days-label {
    text-align: left;
  }
</style>
