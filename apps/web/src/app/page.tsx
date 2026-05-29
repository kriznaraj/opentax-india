import { getWebHealthMessage } from "../lib/health.js";

export default function HomePage() {
  return (
    <main>
      <h1>OpenTax India</h1>
      <p>{getWebHealthMessage()}</p>
      <p>Phase-1 starter is running.</p>
    </main>
  );
}
