<script>
  import {
    Page,
    Navbar,
    Block,
    Button,
    List,
    ListItem,
    ListInput,
    Range,
    Card,
    Link,
  } from "konsta/svelte";
  import { onMount } from "svelte";

  let volume = 100;

  const apiUrl = "https://de1.api.radio-browser.info";

  let searchQuery = "";

  let results = [];

  let player;
  let current = 0;

  let playing = false;

  const fetchSearch = async () => {
    const url = searchQuery
      ? `${apiUrl}/json/stations/search?name=${searchQuery}&hidebroken=true&order=votes&reverse=true`
      : `${apiUrl}/json/stations/topclick`;
    const response = await fetch(url);
    let res = await response.json();
    let mp3res = res.filter((it) => it.codec == "MP3");
    results = mp3res.slice(0, 100);
  };

  const onQueryInput = (e) => {
    searchQuery = e.target.value;
  };

  const onQueryChange = (e) => {
    searchQuery = e.target.value;
    fetchSearch();
  };
  const onQueryClear = () => {
    searchQuery = "";
    fetchSearch();
  };

  const upgradeUrl = (urlstr) => {
    const url = new URL(urlstr);
    url.protocol = "https";
    return url.toString();
  }

  const playAudio = (result) => {
    if (player) player.pause();
    player = new Audio(upgradeUrl(result.url));
    player.play();
    if (result.favicon == "") result.favicon = null;
    current = result;
    playing = true;
  };

  const updateVolume = () => {
    if (!player) return;
    player.volume = volume / 100;
  };

  const togglePause = () => {
    if (!player) return;
    if (playing) player.pause();
    else player.play();
    playing = !playing;
  };

  const seek = (offset) => {
    if (!player) return;
    player.currentTime = player.currentTime + offset;
  };

  onMount(() => {
    fetchSearch();
  });
</script>

<Page>
  <Navbar title="Radiofy">
    <Link
      slot="right"
      navbar
      href="https://github.com/Bnyro/Radiofy"
      target="_blank"
      ><img
        class="h-7 mr-2"
        style="filter: var(--text-filter);"
        src="/github.svg"
        alt=""
      /></Link
    >
  </Navbar>

  <section class="flex flex-col lg:pr-4 lg:flex-row">
    <div class="lg:flex-[3]">
      <Card>
        <Block
          class="h-[80vh] flex flex-col justify-center items-center rounded-xl py-5"
        >
          <img
            src={current?.favicon ? upgradeUrl(current?.favicon) : "/headphones.svg"}
            alt="Station favicon"
            class="grow h-auto aspect-square rounded-full hy-10 mb-5"
            style={current?.favicon ? "" : "filter: var(--filter);"}
          />
          <h1 class="text-3xl my-5">{current?.name ?? "Not active"}</h1>
          <div class="flex my-10 w-full justify-center gap-[10%] lg:gap-[5%]">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <img
              src="/replay_10.svg"
              class="cursor-pointer w-10 lg:w-15"
              style="filter: var(--filter);"
              alt=""
              on:click={() => seek(-10)}
            />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <img
              src={playing ? "/pause_circle.svg" : "/play_circle.svg"}
              class="cursor-pointer w-10 lg:w-15"
              style="filter: var(--filter);"
              alt=""
              on:click={togglePause}
            />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <img
              src="/forward_10.svg"
              class="cursor-pointer w-10 lg:w-15"
              style="filter: var(--filter);"
              alt=""
              on:click={() => seek(10)}
            />
          </div>
          <div class="flex">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <img
              src="/volume_off.svg"
              class="cursor-pointer w-[15%]"
              style="filter: var(--filter);"
              alt=""
              on:click={() => {
                volume = 0;
                updateVolume();
              }}
            />
            <Range
              class="mx-5"
              slot="inner"
              value={volume}
              step={1}
              min={0}
              max={100}
              onInput={(e) => (volume = e.target.value)}
              onChange={updateVolume}
            />
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <img
              src="/volume_up.svg"
              class="cursor-pointer w-[15%]"
              style="filter: var(--filter);"
              alt=""
              on:click={() => {
                volume = 100;
                updateVolume();
              }}
            />
          </div>
        </Block>
      </Card>
    </div>

    <div class="lg:flex-[2]">
      <List>
        <ListInput
          outline
          label="Search"
          value={searchQuery}
          onInput={onQueryInput}
          onChange={onQueryChange}
          onClear={onQueryClear}
          clearButton={searchQuery.length > 0}
        />
      </List>
      <List class="lg:max-h-[75vh] lg:overflow-y-scroll">
        {#each results as result}
          <ListItem title={result.name} href={result.homepage} />
          <Button class="mx-4 w-max" onClick={() => playAudio(result)}
            >Play</Button
          >
        {/each}
      </List>
    </div>
  </section>
</Page>
