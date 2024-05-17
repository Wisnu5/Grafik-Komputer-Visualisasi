// Function to load JSON data
function loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'datapadi.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
        }
    };
    xobj.send(null);
}

// Function to create Line Chart
function createLineChart(data) {
    var traceData = {};

    data.forEach(function (item) {
        if (!traceData[item.Provinsi]) {
            traceData[item.Provinsi] = { x: [], y: [] };
        }
        traceData[item.Provinsi].x.push(item.Tahun);
        traceData[item.Provinsi].y.push(item.Produksi);
    });

    var traces = [];
    for (var provinsi in traceData) {
        traces.push({
            x: traceData[provinsi].x,
            y: traceData[provinsi].y,
            type: 'scatter',
            mode: 'lines',
            name: provinsi
        });
    }

    var layout = {
        title: 'Produksi Padi per Tahun pada Setiap Provinsi',
        xaxis: { title: 'Tahun' },
        yaxis: { title: 'Produksi' }
    };

    Plotly.newPlot('line-chart', traces, layout);
}

// Function to create Pie Chart
function createPieChart(data) {
    var produksi2020 = data.filter(item => item.Tahun === 2020);
    var labels = produksi2020.map(item => item.Provinsi);
    var values = produksi2020.map(item => item.Produksi);

    var trace = {
        labels: labels,
        values: values,
        type: 'pie'
    };

    var layout = {
        title: 'Presentasi Produksi Padi per Provinsi Tahun 2020'
    };

    Plotly.newPlot('pie-chart', [trace], layout);
}

// Function to create Scatter Plot
function createScatterPlot(data) {
    var traceData = {};

    data.forEach(function (item) {
        if (!traceData[item.Provinsi]) {
            traceData[item.Provinsi] = { x: [], y: [] };
        }
        traceData[item.Provinsi].x.push(item.Produksi);
        traceData[item.Provinsi].y.push(item["Curah hujan"]);
    });

    var traces = [];
    for (var provinsi in traceData) {
        traces.push({
            x: traceData[provinsi].x,
            y: traceData[provinsi].y,
            mode: 'markers',
            type: 'scatter',
            name: provinsi
        });
    }

    var layout = {
        title: 'Produksi Padi Berdasarkan Curah Hujan',
        xaxis: { title: 'Produksi' },
        yaxis: { title: 'Curah Hujan' }
    };

    Plotly.newPlot('scatter-plot', traces, layout);
}

// Function to create Geo Chart
function createGeoChart(data) {
    var luasLahan = [317869.41, 388591.22, 295664.47, 64733.13, 84772.93, 551320.76, 64137.28, 545149.05];
    var latitudes = [4.69513500, 2.11535470, -0.73993970, 0.293347, -1.61012290, -3.31943740, -3.79284510, -4.55858490];
    var longitudes = [96.74939930, 99.54509740, 100.80000510, 101.706825, 103.61312030, 103.91439900, 102.26076410, 105.40680790];
    var totalProduksi = [];

    // Calculate Luas Lahan and Total Produksi for each province in 2020
    data.filter(item => item.Tahun === 2020).forEach(function (item) {
        luasLahan.push(item["Luas Panen"]);
        totalProduksi.push(item.Produksi / 1000); // Convert to thousands for color scale
    });

    // Normalize Luas Lahan for marker size
    var maxLuasLahan = Math.max(...luasLahan);
    var normalizedLuasLahan = luasLahan.map(function (luas) {
        return luas / maxLuasLahan;
    });

    var trace = {
        type: 'scattermapbox',
        lat: latitudes,
        lon: longitudes,
        mode: 'markers',
        marker: {
            size: normalizedLuasLahan.map(function (luas) {
                return luas * 50 + 10;
            }),
            color: totalProduksi,
            colorscale: [
                [0, 'rgb(165,0,38)'],
                [0.2, 'rgb(165,0,38)'],
                [0.2, 'rgb(215,48,39)'],
                [0.4, 'rgb(215,48,39)'],
                [0.4, 'rgb(244,109,67)'],
                [0.6, 'rgb(244,109,67)'],
                [0.6, 'rgb(253,174,97)'],
                [0.8, 'rgb(253,174,97)'],
                [0.8, 'rgb(254,224,144)'],
                [1, 'rgb(254,224,144)']
            ],
            colorbar: {
                title: 'Total Produksi Padi di Sumatera tahun 2020',
                ticksuffix: ' ribu'
            }
        },
        text: ['Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Jambi', 'Sumatera Selatan', 'Bengkulu', 'Lampung'],
    };

    var layout = {
        autosize: true,
        hovermode: 'closest',
        mapbox: {
            style: 'open-street-map',
            center: {
                lat: 0.5489,
                lon: 102.0000
            },
            zoom: 5
        },
    };

    Plotly.newPlot('geo-chart', [trace], layout);
}


// Load the JSON data and create charts
loadJSON(function (data) {
    createLineChart(data);
    createPieChart(data);
    createScatterPlot(data);
    createGeoChart(data);
});