// Get the samples.json
const samples = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

// Fetch the JSON data and console log it
d3.json(samples).then(function(data) {
  console.log(data);
});

// Define a function to update the charts based on the selected individual
function updateCharts(selectedIndividual) {
  // Use D3.js to fetch the data from your JSON file
  d3.json("samples.json").then(function(data) {
    // Assuming your data is structured as an array of objects with "names" as IDs

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
  });
}

// Function to create the bubble chart
function createBubbleChart(selectedIndividual) {
  d3.json("samples.json").then(function(data) {
    // Assuming your data is structured as an array of objects with "names" as IDs

    // Filter data for the selected individual
    const individualData = data.samples.find(sample => sample.id === selectedIndividual);

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
  });
}

// Define a function to populate the dropdown menu
function populateDropdown() {
  d3.json("samples.json").then(function(data) {
    const dropdown = d3.select("#selDataset");

    // Extract the names (IDs) of individuals
    const names = data.names;

    // Populate the dropdown with options
    names.forEach(name => {
      dropdown.append("option").attr("value", name).text(name);
    });

    // Initialize the charts with the first individual's data
    const initialIndividual = names[0];
    updateCharts(initialIndividual);
    createBubbleChart(initialIndividual); // Call this function to create the bubble chart
  });
}

// Define a function to handle dropdown change
function optionChanged(selectedIndividual) {
  // Update the charts when a new individual is selected
  updateCharts(selectedIndividual);
  createBubbleChart(selectedIndividual); // Call this function to update the bubble chart
}

// Call the function to populate the dropdown and initialize the charts
populateDropdown();
