let rules = [];

fetch("data/retrieval_rules.json")
  .then(r => r.json())
  .then(data => rules = data);

function generateGuidance() {

  const intent = document.getElementById("intent").value;

  const role =
      document.getElementById("role").value;

  const collection =
      document.getElementById("collection").value;

  const rule =
      rules.find(r => r.intent === intent);

  if (!rule) return;

  document.getElementById("results").innerHTML = `
      <div class="result">

        <h3>Guidance</h3>

        <p><strong>Role:</strong> ${role}</p>

        <p><strong>Collection:</strong> ${collection}</p>

        <p><strong>Action:</strong> ${rule.action}</p>

        <p><strong>Governance:</strong>
            ${rule.governance.join(", ")}
        </p>

      </div>
  `;
}
