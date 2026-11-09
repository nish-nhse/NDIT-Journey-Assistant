let rules = [];
let relationships = [];
let articles = [];
let services = [];
let collections = [];

// ====================================
// CONVERSATION STATE
// ====================================

let conversationState = {
    role: null,
    intent: null,
    collection: null,
    service: null,
    waitingForCollection: false,
    waitingForService: false
};

// ====================================
// LOAD DATA
// ====================================

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

// ====================================
// INTENT DETECTION
// ====================================

function detectIntent(question) {

    const text = question.toLowerCase();

    if (
        text.includes("onboard") ||
        text.includes("ingest") ||
        text.includes("dataset")
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
        text.includes("foundry") ||
        text.includes("crdl") ||
        text.includes("pet") ||
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

// ====================================
// COLLECTION DETECTION
// ====================================

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

    if (text.includes("cwt"))
        return "CWT";

    if (text.includes("elective recovery"))
        return "Elective Recovery";

    if (text.includes("urgent"))
        return "Urgent and Emergency Care";

    return null;
}

// ====================================
// SERVICE DETECTION
// ====================================

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

// ====================================
// HELPER FUNCTIONS
// ====================================

function getRelatedItems(capabilityName) {

    return relationships.filter(r =>
        r.source_name === capabilityName ||
        r.target_name === capabilityName
    );

}

function getArticles(capabilityName) {

    return articles.filter(a =>
        a.capability === capabilityName
    );

}

// ====================================
// MAIN CONVERSATION
// ====================================

function analyseQuestion() {

    const question =
        document.getElementById("question")
            .value
            .trim();

    const role =
        document.getElementById("role").value;

    const resultsDiv =
        document.getElementById("results");

    if (!question) {

        resultsDiv.innerHTML = `
            <div class="result">
                <h2>Please enter a question</h2>
            </div>
        `;

        return;
    }

    conversationState.role = role;

    // ----------------------------
    // Waiting for Collection
    // ----------------------------

    if (conversationState.waitingForCollection) {

        const collection =
            detectCollection(question);

        if (!collection) {

            resultsDiv.innerHTML = `
                <div class="result">

                    <h2>Collection Required</h2>

                    <p>
                        Which collection are you working with?
                    </p>

                    <ul>
                        <li>Cancer</li>
                        <li>Virtual Wards</li>
                        <li>Mental Health</li>
                        <li>Population Health</li>
                        <li>CWT</li>
                    </ul>

                </div>
            `;

            return;
        }

        conversationState.collection = collection;
        conversationState.waitingForCollection = false;

        if (!conversationState.service) {

            conversationState.waitingForService = true;

            resultsDiv.innerHTML = `
                <div class="result">

                    <h2>Collection Identified</h2>

                    <p>
                        Collection:
                        <strong>${collection}</strong>
                    </p>

                    <p>
                        Which service are you using?
                    </p>

                    <ul>
                        <li>Foundry</li>
                        <li>CRDL</li>
                        <li>MESH</li>
                        <li>PET</li>
                        <li>DVE</li>
                    </ul>

                </div>
            `;

            return;
        }
    }

    // ----------------------------
    // Waiting for Service
    // ----------------------------

    if (conversationState.waitingForService) {

        const service =
            detectService(question);

        if (!service) {

            resultsDiv.innerHTML = `
                <div class="result">

                    <h2>Service Required</h2>

                    <p>
                        Please tell me which service
                        you are using.
                    </p>

                    <ul>
                        <li>Foundry</li>
                        <li>CRDL</li>
                        <li>MESH</li>
                        <li>PET</li>
                        <li>DVE</li>
                    </ul>

                </div>
            `;

            return;
        }

        conversationState.service = service;
        conversationState.waitingForService = false;

        findAndRenderGuidance();
        return;
    }

    // ----------------------------
    // New Question
    // ----------------------------

    conversationState.intent =
        detectIntent(question);

    conversationState.collection =
        detectCollection(question);

    conversationState.service =
        detectService(question);

    if (!conversationState.intent) {

        resultsDiv.innerHTML = `
            <div class="result">

                <h2>I couldn't determine the request</h2>

                <p>Try asking something like:</p>

                <ul>
                    <li>I need help onboarding a dataset</li>
                    <li>I need access to data</li>
                    <li>I need governance approval</li>
                    <li>I need to integrate MESH</li>
                </ul>

            </div>
        `;

        return;
    }

    if (!conversationState.collection) {

        conversationState.waitingForCollection = true;

        resultsDiv.innerHTML = `
            <div class="result">

                <h2>I understand your request</h2>

                <p>
                    Which collection or dataset
                    are you working with?
                </p>

                <ul>
                    <li>Cancer</li>
                    <li>Virtual Wards</li>
                    <li>Mental Health</li>
                    <li>Population Health</li>
                    <li>CWT</li>
                </ul>

            </div>
        `;

        return;
    }

    if (!conversationState.service) {

        conversationState.waitingForService = true;

        resultsDiv.innerHTML = `
            <div class="result">

                <h2>Collection Identified</h2>

                <p>
                    Collection:
                    <strong>${conversationState.collection}</strong>
                </p>

                <p>
                    Which service are you using?
                </p>

                <ul>
                    <li>Foundry</li>
                    <li>CRDL</li>
                    <li>MESH</li>
                    <li>PET</li>
                    <li>DVE</li>
                </ul>

            </div>
        `;

        return;
    }

    findAndRenderGuidance();
}

// ====================================
// FIND GUIDANCE
// ====================================

function findAndRenderGuidance() {

    const resultsDiv =
        document.getElementById("results");

    const matchedRule = rules.find(r =>

        r.intent === conversationState.intent &&
        r.role === conversationState.role &&
        r.collection === conversationState.collection &&
        r.service === conversationState.service

    );

    if (!matchedRule) {

        resultsDiv.innerHTML = `
            <div class="result">

                <h2>No Guidance Found</h2>

                <p>I understood:</p>

                <ul>

                    <li>
                        Intent:
                        ${conversationState.intent}
                    </li>

                    <li>
                        Role:
                        ${conversationState.role}
                    </li>

                    <li>
                        Collection:
                        ${conversationState.collection}
                    </li>

                    <li>
                        Service:
                        ${conversationState.service}
                    </li>

                </ul>

            </div>
        `;

        return;
    }

    renderGuidance(matchedRule);
}

// ====================================
// RENDER GUIDANCE
// ====================================

function renderGuidance(rule) {

    const resultsDiv =
        document.getElementById("results");

    resultsDiv.innerHTML = `

        <div class="result">

            <h2>NDIT Guidance</h2>

            <p><strong>Capability:</strong> ${rule.capability}</p>

            <p><strong>Description:</strong><br>${rule.description}</p>

            <p><strong>Owner:</strong><br>${rule.owner}</p>

            <p><strong>Timescale:</strong><br>${rule.timescale}</p>

            <h3>Governance Requirements</h3>

            <ul>
                ${rule.governance.map(
                    g => `<li>${g}</li>`
                ).join("")}
            </ul>

            <h3>Required Steps</h3>

            <ol>
                ${rule.steps.map(
                    step => `<li>${step}</li>`
                ).join("")}
            </ol>

            <h3>Knowledge Articles</h3>

            <ul>
                ${rule.articles.map(
                    article => `<li>${article}</li>`
                ).join("")}
            </ul>

        </div>

    `;
}
