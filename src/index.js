// Get mermaid from the bundled package
const { mermaid } = window.MermaidBundle;

function parseAndFilterMermaidDiagram(diagramText, excludedEntities) {
    if (!excludedEntities || excludedEntities.length === 0) {
        return diagramText;
    }

    const lines = diagramText.trim().split('\n');
    let filteredLines = [];
    let currentEntity = null;
    let skipCurrentEntity = false;

    lines.forEach(line => {
        const trimmedLine = line.trim();

        // Always include erDiagram line
        if (trimmedLine === 'erDiagram') {
            filteredLines.push(line);
            return;
        }

        // Check for relationship lines
        if (trimmedLine.includes('||') || trimmedLine.includes('--|') || 
            trimmedLine.includes('--o') || trimmedLine.includes('o--')) {
            const parts = trimmedLine.split(/\s+/);
            const entity1 = parts[0];
            const entity2 = parts[2];
            if (!excludedEntities.includes(entity1) && !excludedEntities.includes(entity2)) {
                filteredLines.push(line);
            }
            return;
        }

        // Check for entity definition start
        if (trimmedLine.includes('{')) {
            currentEntity = trimmedLine.split(/\s+/)[0];
            skipCurrentEntity = excludedEntities.includes(currentEntity);
            if (!skipCurrentEntity) {
                filteredLines.push(line);
            }
            return;
        }

        // Check for entity definition end
        if (trimmedLine.includes('}')) {
            if (!skipCurrentEntity) {
                filteredLines.push(line);
            }
            currentEntity = null;
            skipCurrentEntity = false;
            return;
        }

        // Handle entity attributes
        if (currentEntity && !skipCurrentEntity) {
            filteredLines.push(line);
        }
    });

    return filteredLines.join('\n');
}

async function loadAndRenderDiagram() {
    mermaid.initialize({ 
        startOnLoad: false,
        securityLevel: 'loose',
        er: { 
            diagramPadding: 20 
        }
    });
    
    const urlParams = new URLSearchParams(window.location.search);
    const files = urlParams.get('files')?.split(',') || ['database.mmd'];
    const excludeEntities = urlParams.get('exclude')?.split(',') || [];
    
    let combinedDiagram = '';
    
    // Load and combine all diagram files
    for (const file of files) {
        try {
            const response = await fetch(file);
            if (!response.ok) throw new Error(`Failed to load ${file}`);
            const content = await response.text();
            combinedDiagram += content + '\n';
        } catch (error) {
            console.error(`Error loading diagram file ${file}:`, error);
            document.querySelector("#error").textContent = `Error loading ${file}`;
            return;
        }
    }

    try {
        // Filter out excluded entities
        const filteredDiagram = parseAndFilterMermaidDiagram(combinedDiagram, excludeEntities);
        console.log('Filtered diagram:', filteredDiagram); // For debugging
        
        // Render the filtered diagram
        const element = document.querySelector("#diagram");
        const { svg } = await mermaid.render('graphDiv', filteredDiagram);
        element.innerHTML = svg;
    } catch (error) {
        console.error('Error rendering diagram:', error);
        document.querySelector("#error").textContent = 'Error rendering diagram: ' + error.message;
    }
}

document.addEventListener('DOMContentLoaded', loadAndRenderDiagram);