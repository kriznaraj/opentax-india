export function getWorkerHealth(): { status: "ok"; service: "worker" } {
  return {
    status: "ok",
    service: "worker"
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const health = getWorkerHealth();
  console.log(`@opentax/worker booted (${health.status})`);
}
