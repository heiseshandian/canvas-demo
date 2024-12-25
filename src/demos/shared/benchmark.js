export function benchmark(fn, name = fn.name, iterations = 1000) {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = performance.now();
  const totalTime = end - start;
  const averageTime = totalTime / iterations;

  console.log(`${name} Total time: ${totalTime.toFixed(4)} ms`);
  console.log(
    `${name} Average time per iteration: ${averageTime.toFixed(4)} ms`
  );
}
