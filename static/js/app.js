// Get the samples.json
const samples = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Fetch the JSON data and console log it
d3.json(samples).then(function(data) {
  console.log(data);
});

// Function to update the charts based on the selected individual
function updateCharts(selectedIndividual) {
  // Use D3.js to fetch the data from your JSON file
  d3.json("samples.json").then(function(data) {
    // Filter data for the selected individual
    const individualData = data.samples.find(sample => sample.id === selectedIndividual);

    // get the top 10 OTUs by sample_values
    const sortedData = individualData.sample_values.slice(0, 10).reverse();
    const otuLabels = individualData.otu_ids.slice(0, 10).map(id => `OTU ${id}`);
    const hoverText = individualData.otu_labels.slice(0, 10);

    // Create the horizontal bar chart
    var trace1 = {
      x: sortedData,
      y: otuLabels,
      text: hoverText,
      type: "bar",
      orientation: "h"
    };

    var layout = {
      title: `Top 10 OTUs for Individual ${selectedIndividual}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU ID" }
    };

    Plotly.newPlot("bar", [trace1], layout);
    
    // Call the function to display demographic info
    displayDemographicInfo(selectedIndividual, data.metadata);
    
    // Call the function to create the bubble chart
    createBubbleChart(selectedIndividual, data.samples);
    
    // Call the function to create the gauge chart
    createGaugeChart(selectedIndividual, data.metadata);
  });
}

// Function to create the bubble chart
function createBubbleChart(selectedIndividual, samplesData) {
  // Filter data for the selected individual
  const individualData = samplesData.find(sample => sample.id === selectedIndividual);

  // Define trace for the bubble chart
  var trace2 = {
    x: individualData.otu_ids,
    y: individualData.sample_values,
    text: individualData.otu_labels,
    mode: "markers",
    marker: {
      size: individualData.sample_values,
      color: individualData.otu_ids,
      colorscale: "Earth" // You can choose a colorscale
    }
  };

  var data2 = [trace2];

  var layout2 = {
    title: `Bubble Chart for Individual ${selectedIndividual}`,
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Values" }
  };

  // Create the bubble chart
  Plotly.newPlot("bubble", data2, layout2);
}

// Function to create the gauge chart
function createGaugeChart(selectedIndividual, metadata) {
  // Filter metadata for the selected individual
  const individualMetadata = metadata.find(item => item.id === parseInt(selectedIndividual));
    
  // Define the data for the gauge chart
  const data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: individualMetadata.wfreq,
      title: `Belly Button Washing Frequency<br>Scrubs per Week for Individual ${selectedIndividual}`,
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: { range: [0, 9] },
        steps: [
          { range: [0, 1], color: "lightgray" },
          { range: [1, 2], color: "lightgreen" },
          { range: [2, 3], color: "yellow" },
          { range: [3, 4], color: "orange" },
          { range: [4, 5], color: "red" },
          { range: [5, 6], color: "purple" },
          { range: [6, 7], color: "blue" },
          { range: [7, 8], color: "darkblue" },
          { range: [8, 9], color: "darkpurple" }
        ],
      },
    },
  ];

  // Define the layout for the gauge chart
  const layout = { width: 400, height: 300, margin: { t: 0, b: 0 } };
    
  // Plot the gauge chart
  Plotly.newPlot("gauge", data, layout);
}

// Define a function to populate the dropdown menu
function populateDropdown() {
  d3.json("samples.json").then(function(data) {
    const dropdown = d3.select("#selDataset");
    const metadata = data.metadata; // Get the metadata
    
    // Extract the names (IDs) of individuals
    const names = data.names;

    // Populate the dropdown with options
    names.forEach(name => {
      dropdown.append("option").attr("value", name).text(name);
    });

    // Initialize the charts with the first individual's data
    const initialIndividual = names[0];
    updateCharts(initialIndividual);
  });
}

// Define a function to handle dropdown change
function optionChanged(selectedIndividual) {
  // Update the charts when a new individual is selected
  updateCharts(selectedIndividual);
}

// Call the function to populate the dropdown and initialize the charts
populateDropdown();

// Function to display demographic info
function displayDemographicInfo(selectedIndividual, metadata) {
  // Select the HTML element where you want to display the info
  const demographicInfo = d3.select("#sample-metadata");
  
  // Filter metadata for the selected individual
  const individualMetadata = metadata.find(item => item.id === parseInt(selectedIndividual));
  
  // Clear any existing data
  demographicInfo.html("");
  
  // Iterate through the metadata and append key-value pairs
  Object.entries(individualMetadata).forEach(([key, value]) => {
    demographicInfo.append("p").text(`${key}: ${value}`);
  });
}
