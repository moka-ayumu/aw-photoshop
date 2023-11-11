<script lang="ts">
  import { onMount } from 'svelte';
  import { AWClient, type IEvent } from 'aw-client';
  import photoshop from 'photoshop';

  const bucketId = 'aw-photoshop';
  const client = new AWClient('aw-photoshop-watcher');
  let start_time = 0;
  let heartbeat: IEvent | undefined = undefined;
  let errorMessage: string | undefined = undefined;
  let state: 'connected' | 'disconnected' = 'disconnected';

  onMount(() => {
    connect();
  });

  function connect() {
    errorMessage = undefined;
    client
      .getBuckets()
      .then((buckets) => {
        state = 'connected';
        let i = Object.keys(buckets).indexOf(bucketId);
        if (i === -1) {
          client.getInfo().then((info) => {
            client.createBucket(bucketId, 'app.editor.activity', info.hostname).then(() => initEvent());
          });
        } else {
          initEvent();
        }
      })
      .catch(() => {
        errorMessage = 'The connection failed.';
      });
  }

  function initEvent() {
    photoshop.action.addNotificationListener(['modalStateChanged', 'toolModalStateChanged'], (event, descriptor) => {
      if (descriptor.state._value == 'enter') {
        start_time = performance.now();
      } else {
        const { path, name } = photoshop.app.activeDocument;
        const folder = path.substring(0, path.lastIndexOf('\\'));
        const duration = (performance.now() - start_time) / 1000;
        const tool_title = event === 'modalStateChanged' ? descriptor.title : descriptor.tool.title;
        heartbeat = {
          timestamp: new Date(),
          duration,
          data: {
            file: name,
            cwd: folder,
            type: tool_title,
          },
        };
        client.heartbeat(bucketId, 5, heartbeat);
      }
    });
  }
</script>

<main class="flex flex-col text-base">
  <div class="w-full bg-slate-3 py-3 px-5">
    <p class="text-2xl font-medium">Photoshop ActivityWatch</p>
  </div>
  <div class="py-3 px-5 flex-1">
    {#if errorMessage}
      <p>{errorMessage}</p>
    {/if}
    {#if state === 'disconnected'}
      <button on:click={connect}>Connect</button>
    {:else}
      <p class="font-medium text-lg">Recent Event</p>
      {#if heartbeat}
        <p>{heartbeat.data.type}</p>
        <p>{heartbeat.duration}s</p>
      {/if}
    {/if}
  </div>
</main>
