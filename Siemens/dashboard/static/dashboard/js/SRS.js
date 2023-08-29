
const histogramData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Connected', backgroundColor: '#FF5733', data: [10, 20, 30, 40, 50, 60] },
      { label: 'X_connectable', backgroundColor: '#008B8B', data: [5, 15, 25, 35, 45, 55] },
      
    ]
  };
  
  const histogramOptions = {
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };
  
  new Chart(document.getElementById('histogram1'), {
    type: 'bar',
    data: histogramData,
    options: histogramOptions
  });
// histogramme 2
  const histogramData2 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'RUH Ready', backgroundColor: '#FF5733', data: [10, 20, 30, 40, 50, 60] },
      { label: 'X_not RUH ready', backgroundColor: '#008B8B', data: [5, 15, 25, 35, 45, 55] },
      
    ]
  };
  
  const histogramOptions2 = {
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };
  
  new Chart(document.getElementById('histogram2'), {
    type: 'bar',
    data: histogramData2,
    options: histogramOptions2
  });
  // histogramme 3
  const histogramData3 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Data sent', backgroundColor: '#FF5733', data: [10, 20, 30, 40, 50, 60] },
      { label: 'X_Data not sent', backgroundColor: '#008B8B', data: [5, 15, 25, 35, 45, 55] },
      
    ]
  };
  
  const histogramOptions3 = {
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };
  
  new Chart(document.getElementById('histogram3'), {
    type: 'bar',
    data: histogramData3,
    options: histogramOptions3
  });

  // histogramme 4
  const histogramData4 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'Connection active', backgroundColor: '#FF5733', data: [10, 20, 30, 40, 50, 60] },
      { label: 'Connection not active', backgroundColor: '#008B8B', data: [5, 15, 25, 35, 45, 55] },
      
    ]
  };
  
  const histogramOptions4 = {
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };
  
  new Chart(document.getElementById('histogram4'), {
    type: 'bar',
    data: histogramData4,
    options: histogramOptions4
  });
  // histogramme 5 
  const histogramData5 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'CAN24 Connectable', backgroundColor: '#FF5733', data: [10, 20, 30, 40, 50, 60] },
      { label: 'X_NOT CAN24 Connectable', backgroundColor: '#008B8B', data: [5, 15, 25, 35, 45, 55] },
      
    ]
  };
  
  const histogramOptions5 = {
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };
  
  new Chart(document.getElementById('histogram5'), {
    type: 'bar',
    data: histogramData5,
    options: histogramOptions5
  });
  
  // histogramme 6
  const histogramData6 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'CAN24 Connectable', backgroundColor: '#FF5733', data: [10, 20, 30, 40, 50, 60] },
      { label: 'X_NOT CAN24 Connectable', backgroundColor: '#008B8B', data: [5, 15, 25, 35, 45, 55] },
      
    ]
  };
  
  const histogramOptions6 = {
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };
  
  new Chart(document.getElementById('histogram6'), {
    type: 'bar',
    data: histogramData6,
    options: histogramOptions6
  });
  // histogramme 7
  const histogramData7 = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      { label: 'CAN24 Connectable', backgroundColor: '#FF5733', data: [10, 20, 30, 40, 50, 60] },
      { label: 'X_NOT CAN24 Connectable', backgroundColor: '#008B8B', data: [5, 15, 25, 35, 45, 55] },
      
    ]
  };
  
  const histogramOptions7 = {
    scales: {
      x: { stacked: true },
      y: { stacked: true }
    }
  };
  
  new Chart(document.getElementById('histogram7'), {
    type: 'bar',
    data: histogramData7,
    options: histogramOptions7
  });
  
  