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

    console.log("Data loaded successfully");

})
.catch(error => {
    console.error("Failed to load data:", error);
});


// -----------------------------------
// INTENT DETECTION
// -----------------------------------

function detectIntent(question) {

    const text = question.toLowerCase();

    if (
        text.includes("onboard") ||
        text.includes("ingest") ||
        text.includes("new dataset")
    ) {
        return "how-onboard";
    }

    if (
        text.includes("access") ||
        text.includes("permission")
    ) {
        return "how-access";
    }

    if (
        text.includes("approval") ||
        text.includes("approve") ||
        text.includes("dpia") ||
        text.includes("dsa")
    ) {
        return "approval";
    }

    if (
        text.includes("integrate") ||
        text.includes("integration") ||
        text.includes("mesh") ||
        text.includes("crdl") ||
        text.includes("pet") ||
        text.includes("foundry") ||
        text.includes("dve")
    ) {
        return "integration";
    }

    if (
        text.includes("export") ||
        text.includes("egress")
    ) {
        return "export";
    }

    return null;
}


// -----------------------------------
// COLLECTION DETECTION
// -----------------------------------

function detectCollection(question) {

    const text = question.toLowerCase();

    if (text.includes("cancer"))
        return "Cancer";

    if (text.includes("virtual wards"))
        return "Virtual Wards";

    if (text.includes("mental health"))
        return "Mental Health";

    if (text.includes("population health"))
        return "Population Health";

    if (text.includes("primary care"))
        return "Primary Care";

    if (text.includes("elective recovery"))
        return "Elective Recovery";

    if (text.includes("urgent"))
        return "Urgent and Emergency Care";

    if (text.includes("cwt"))
        return "CWT";

    return null;
}


// -----------------------------------
// SERVICE DETECTION
// -----------------------------------

function detectService(question) {

    const text = question.toLowerCase();

    if (text.includes("foundry"))
        return "Foundry";

    if (text.includes("mesh"))
        return "MESH";

    if (text.includes("crdl"))
        return "CRDL";

    if (text.includes("pet"))
        return "PET";

    if (text.includes("dve"))
        return "DVE";

    return null;
}


// -----------------------------------
// ANALYSE QUESTION
// -----------------------------------

function analyseQuestion() {

    const question =
        document.getElementById("question").value;

    if (!question) {
        alert("Please enter a question");
        return;
    }

    const intent =
        detectIntent(question);

    const collection =
        detectCollection(question);

    const service =
        detectService(question);

    console.log("Intent:", intent);
    console.log("Collection:", collection);
    console.log("Service:", service);

    if (!intent) {

        alert(
            "Could not determine intent from your question."
        );

        return;
    }

    document.getElementById("intent").value = intent;

    if (collection) {
        document.getElementById("collection").value =
            collection;
    }

    if (service) {
        document.getElementById("service").value =
            service;
    }

    generateGuidance();
}


// -----------------------------------
// GRAPH FUNCTIONS
// -----------------------------------

function getRelatedItems(capabilityName) {

    return relationships.filter(r =>
        r.source === capabilityName ||
        r.target === capabilityName
    );

}

function getArticles(capabilityName) {

    return articles.filter(a =>
        a.capability === capabilityName
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

    const rule = rules.find(r =>
        r.intent === intent &&
        r.role === role &&
        r.collection === collection &&
        r.service === service
    );

    if (!rule) {

        resultsDiv.innerHTML = `
            <div class="result">
                <h2>No Matching Guidance Found</h2>

                <ul>
                    <li><strong>Intent:</strong> ${intent}</li>
                    <li><strong>Role:</strong> ${role}</li>
                    <li><strong>Collection:</strong> ${collection}</li>
                    <li><strong>Service:</strong> ${service}</li>
                </ul>

                <p>
                  Add a matching rule to
                  retrieval_rules.json
                </p>

            </div>
        `;

        return;
    }

    const relatedItems =
        getRelatedItems(rule.capability);

    const matchedArticles =
        getArticles(rule.capability);

    resultsDiv.innerHTML = `

        <div class="result">

            <h2>NDIT Guidance</h2>

            <p><strong>Role:</strong> ${role}</p>

            <p><strong>Collection:</strong> ${collection}</p>

            <p><strong>Service:</strong> ${service}</p>

            <p><strong>Journey:</strong> ${rule.journey}</p>

            <p><strong>Capability:</strong> ${rule.capability}</p>

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

            <h3>Governance Requirements</h3>

            <ul>
            ${rule.governance.map(g =>
                `<li>${g}</li>`
            ).join("")}
            </ul>

            <h3>Required Steps</h3>

            <ol>
            ${rule.steps.map(step =>
                `<li>${step}</li>`
            ).join("")}
            </ol>

            <h3>Knowledge Articles</h3>

            <ul>
            ${matchedArticles.map(article =>
                `<li>${article.title}</li>`
            ).join("")}
            </ul>

            <h3>Knowledge Graph Connections</h3>

            <ul>
            ${relatedItems.map(rel =>
                `<li>${rel.source} ${rel.relationship} ${rel.target}</li>`
            ).join("")}
            </ul>

            <div class="next-action">

                <strong>Next Action</strong>

                <p>${rule.action}</p>

            </div>

        </div>
    `;
}
