console.log()
// Create function to initialize dashboard
function init() {
  // Grab reference to dropdown select element
  var selector = d3.select("#selDataset");

  // Use list of sample names to populate select options
  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use first sample from list to build initial plots
    var firstSample = sampleNames[0];
    buildMetadata(firstSample);
    buildCharts(firstSample);
  });
}

// Call function to initialize dashboard
init();

// Create function to handle selection of new sample
function optionChanged(newSample) {
  // Fetch new data each time new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Create function to populate demographic info 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {

    // Create variable that holds metadata array
    var metadata = data.metadata;
    
    // Filter metadata for object with desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var selectedResult = resultArray[0];
    
    // Use d3 to select panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Clear any existing metadata
    PANEL.html("");

    // Add each key-value pair to panel
    Object.entries(selectedResult).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// Create function to populate charts
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {

    // Get data needed for BAR CHART and BUBBLE CHART
    // Create variable that holds samples array
    var samples = data.samples; 
    console.log(samples);

    // Filter samples for object with desired sample number
    var sampleArray = samples.filter(sampleObj => sampleObj.id == sample);
    var selectedSample = sampleArray[0];
    console.log(selectedSample);

    // Create variables that hold otu_ids, otu_labels, and sample_values
    var otuIds = selectedSample.otu_ids;
    var otuLabels = selectedSample.otu_labels;
    var sampleValues = selectedSample.sample_values;
    console.log(otuIds);
    console.log(otuLabels);
    console.log(sampleValues);

    // BAR CHART
    // Create trace for bar chart 
    var barData = [{
      x: sampleValues.slice(0,10).reverse(),
      y: otuIds.slice(0, 10).map(id => `OTU ${id} `).reverse(),
      text: otuLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: "#31688e"
      },
      hoverinfo: "x+y+text"
    }];

    // Create layout for bar chart 
    var barLayout = {
      title: {
        text: "<b>Top 10 Bacteria Cultures Found<b>",
        font: {size: 20}
      },
      xaxis: {title: "Sample Value"},
      yaxis: {title: "Bacteria ID #"}, 
      margin: {
        l: 100,
        r: 25,
        t: 50,
        b: 100
      },
      hovermode: "closest",
    };

    // Plot bar chart
    Plotly.newPlot("bar", barData, barLayout); 

    // BUBBLE CHART
    // Create trace for bubble chart
    var bubbleData = [{
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Viridis"
      },
      hoverinfo: "x+y+text"
    }];
    
    // Create layout for bubble chart
    var bubbleLayout = {
      title: {
        text: "<b>Bacteria Cultures Per Sample<b>",
        font: {size: 20}
      },
      xaxis: {title: "Bacteria ID # (OTU ID)"},
      yaxis: {title: "Sample Value"},
      margin: {
        l: 100,
        r: 100,
        t: 50,
        b: 50
      },
      hovermode: "closest",
    };
    
    // Plot bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  
    // Get data needed for GAUGE CHART
    // Create variable that holds metadata array
    var metadata = data.metadata;
    console.log(metadata);
    
    // Filter metadata for object with desired sample number
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var selectedMetadata = metadataArray[0];
    console.log(selectedMetadata);

    // Create variable that holds washing frequency and converts it to floating point number
    var washFreq = parseFloat(selectedMetadata.wfreq);
    console.log(washFreq);

    // GAUGE CHART
    // Create trace for gauge chart
    var gaugeData = [{
      value: washFreq,
      title: {
        text: "<b>Belly Button Washing Frequency</b><br>" + "Scrubs Per Week",
        font: {size: 20}
      },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10]},
        steps: [
          {range: [0, 2], color: "#fde725"},
          {range: [2, 4], color: "#6ece58"},
          {range: [4, 6], color: "#1f9e89"},
          {range: [6, 8], color: "#31688e"},
          {range: [8, 10], color: "#482878"}
        ],
        bar: {
          color: "#444"
        }
      }
    }];

    // Create layout for gauge chart
    var gaugeLayout = {
      height: 400,
      width: 600,
    };

    // Plot gauge chart
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}