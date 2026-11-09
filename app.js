let rules = [];
let relationships = [];
let articles = [];
let services = [];
let collections = [];

// -----------------------------------
// LOAD DATA
// -----------------------------------

Promise.all([
    fetch("data/retrieval_rules.json").then(r => r.json()),
    fetch("data/knowledge_graph_relationships.json").then(r => r.json()),
    fetch("data/knowledge_articles.json").then(r => r.json()),
    fetch("data/services.json").then(r => r.json()),
    fetch("data/collections.json").then(r => r.json())
])
.then(([ruleData, relationshipData, articleData, serviceData, collectionData]) => {

    rules = ruleData;
    relationships = relationshipData;
    articles = articleData;
    services = serviceData;
    collections = collectionData;

    console.log("Rules loaded:", rules);
    console.log("Relationships loaded:", relationships);
    console.log("Articles loaded:", articles);
    console.log("Services loaded:", services);
    console.log("Collections loaded:", collections);

})
.catch(error => {
    console.error("Failed to load data:", error);
});

// -----------------------------------
// INTENT DETECTION
// -----------------------------------

function detectIntent(question) {

    const text = question.toLowerCase();

    // Onboarding

    if (
        text.includes("onboard") ||
        text.includes("ingest") ||
        text.includes("new dataset")
    ) {
        return "how-onboard";
    }

    // Access

    if (
        text.includes("access") ||
        text.includes("permission") ||
        text.includes("authorisation") ||
        text.includes("authorization")
    ) {
        return "how-access";
    }

    // Governance

    if (
        text.includes("approval") ||
        text.includes("approve") ||
        text.includes("dpia") ||
        text.includes("dsa") ||
        text.includes("governance")
    ) {
        return "approval";
    }

    // Integration

    if (
        text.includes("integrate") ||
        text.includes("integration") ||
        text.includes("mesh") ||
        text.includes("pet") ||
        text.includes("crdl") ||
        text.includes("foundry") ||
        text.includes("dve")
    ) {
        return "integration";
    }

    // Export

    if (
        text.includes("export") ||
        text.includes("extract") ||
        text.includes("egress")
    ) {
        return "export";
    }

    return null;
}


// -----------------------------------
// QUESTION ANALYSIS
// -----------------------------------

function analyseQuestion() {

    const question =
        document.getElementById("question").value;

    if (!question) {

        alert("Please enter a question.");

        return;
    }

    const detectedIntent =
        detectIntent(question);

    if (!detectedIntent) {

        alert(
            "Could not determine intent from your question."
        );

        return;
    }

    document.getElementById("intent").value =
        detectedIntent;

    generateGuidance();
}

// -----------------------------------
// GRAPH HELPERS
// -----------------------------------

function getRelatedItems(capabilityName) {

    return relationships.filter(rel =>
        rel.source === capabilityName ||
        rel.target === capabilityName
    );

}

function getArticlesForCapability(capabilityName) {

    return articles.filter(article =>
        article.capability === capabilityName
    );

}

function getServiceInfo(serviceName) {

    return services.find(service =>
        service.name === serviceName
    );

}

function getCollectionInfo(collectionName) {

    return collections.find(collection =>
        collection.name === collectionName
    );

}

// -----------------------------------
// MAIN GUIDANCE ENGINE
// -----------------------------------

function generateGuidance() {

    const intent =
        document.getElementById("intent").value;

    const role =
        document.getElementById("role").value;

    const collection =
        document.getElementById("collection").value;

    const service =
        document.getElementById("service").value;

    const resultsDiv =
        document.getElementById("results");

    const rule =
        rules.find(r =>
            r.intent === intent &&
            r.role === role &&
            r.collection === collection &&
            r.service === service
        );

    if (!rule) {

        resultsDiv.innerHTML = `

            <div class="result">

                <h2>No Matching Guidance Found</h2>

                <p>
                    We do not currently have a rule
                    matching this exact scenario.
                </p>

                <ul>
                    <li><strong>Intent:</strong> ${intent}</li>
                    <li><strong>Role:</strong> ${role}</li>
                    <li><strong>Collection:</strong> ${collection}</li>
                    <li><strong>Service:</strong> ${service}</li>
                </ul>

                <p>
                    Add a matching entry to
                    retrieval_rules.json
                </p>

            </div>

        `;

        return;
    }

    const serviceInfo =
        getServiceInfo(service);

    const collectionInfo =
        getCollectionInfo(collection);

    const matchedArticles =
        getArticlesForCapability(
            rule.capability
        );

    const relatedGraphItems =
        getRelatedItems(
            rule.capability
        );

    resultsDiv.innerHTML = `

        <div class="result">

            <h2>NDIT Guidance</h2>

            <p>
                <strong>Role:</strong>
                ${role}
            </p>

            <p>
                <strong>Collection:</strong>
                ${collection}
            </p>

            <p>
                <strong>Service:</strong>
                ${service}
            </p>

            <p>
                <strong>Journey Stage:</strong>
                ${rule.journey || "Not Defined"}
            </p>

            <p>
                <strong>Capability:</strong>
                ${rule.capability}
            </p>

            <p>
                <strong>Description:</strong><br>
                ${rule.description}
            </p>

            <p>
                <strong>Owner:</strong><br>
                ${rule.owner}
            </p>

            <p>
                <strong>Timescale:</strong><br>
                ${rule.timescale}
            </p>

            <h3>Service Information</h3>

            <p>
                ${serviceInfo?.description || ""}
            </p>

            <h3>Governance Requirements</h3>

            <ul>
                ${rule.governance
                    .map(item => `<li>${item}</li>`)
                    .join("")}
            </ul>

            <h3>Required Steps</h3>

            <ol>
                ${rule.steps
                    .map(step => `<li>${step}</li>`)
                    .join("")}
            </ol>

            <h3>Knowledge Articles</h3>

            <ul>
                ${matchedArticles
                    .map(article =>
                        `<li>${article.title}</li>`
                    )
                    .join("")}
            </ul>

            <h3>Knowledge Graph Connections</h3>

            <ul>
                ${relatedGraphItems
                    .map(rel =>
                        `<li>
                            ${rel.source}
                            ${rel.relationship}
                            ${rel.target}
                        </li>`
                    )
                    .join("")}
            </ul>

            <div class="next-action">

                <strong>Next Action</strong>

                <br><br>

                ${rule.action}

            </div>

            <div class="feedback">

                <h3>
                    Was this guidance useful?
                </h3>

                <button
                    onclick="submitFeedback('yes')">

                    👍 Yes

                </button>

                <button
                    onclick="submitFeedback('no')">

                    👎 No

                </button>

            </div>

        </div>

    `;
}

// -----------------------------------
// FEEDBACK
// -----------------------------------

function submitFeedback(response) {

    alert(
        "Feedback recorded: " +
        response
    );

}
