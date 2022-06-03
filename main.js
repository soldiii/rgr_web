const ctx = document.getElementById('Histogram');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Data',
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            legend: {
                display: false

            },
            title: {
                display: true,
                text: 'Название гистограммы'
            }

        }
    }
});

function LoadAsCSV(){
    myChart.data.labels.length = 0;
    myChart.data.datasets[0].data.length = 0;

    Papa.parse(document.getElementById('uploadfile').files[0],
    {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results){
            for(var i = 0; i < results.data.length; i++){
                if(isNaN(Number(results.data[i].value))|| isNaN(parseFloat(results.data[i].value))){
                    var str = `Некорректные данные в строке ${i + 1}: значение должно быть целочисленным или с плавающей запятой.`; 
                    alert(str);
                    myChart.data.labels.length = 0;
                    myChart.data.datasets[0].data.length = 0;
                    myChart.update();
                    return;
                }
                if(results.data[i].label.replace(/\s+/g, '') == ''){
                    var str = `Некорректные данные в строке ${i + 1}: не введено название столбца`;
                    alert(str);
                    myChart.data.labels.length = 0;
                    myChart.data.datasets[0].data.length = 0;
                    myChart.update();
                    return;
                }

                for (var j = 0; j < myChart.data.labels.length; ++j){
                    var a = myChart.data.labels[j];
                    if (a == results.data[i].label){
                        var str = `Некорректные данные в строке ${i + 1}: такой столбец уже существует`;
                        alert(str);
                        myChart.data.labels.length = 0;
                        myChart.data.datasets[0].data.length = 0;
            
                        myChart.update();
                        return;
                    }
            
                }

                myChart.data.labels.push(results.data[i].label);
                myChart.data.datasets[0].data.push(results.data[i].value);
                myChart.update();
            }
        }
    });
}

function ChangeName(){
    var val = document.getElementById('input1').value;
    myChart.options.plugins.title.text = val;
    myChart.update();
}

function DeleteColumn(){
    var val = document.getElementById('input2').value;
    var pos = myChart.data.labels.indexOf(val);
    if(pos == -1){
        alert("Данные некорректны :введенного названия столбца не существует в гистограмме")
        return;
    }
    myChart.data.labels.splice(pos,1);
    myChart.data.datasets[0].data.splice(pos,1);
    myChart.update();
}

function CleanChart(){
    myChart.data.labels.length = 0;
    myChart.data.datasets[0].data.length = 0;
    myChart.update();
}

function AddColumn(){
    var label = document.getElementById('label').value;
    var value = document.getElementById('value').value;
    if(isNaN(Number(value))|| isNaN(parseFloat(value))){
        alert("Некорректный тип данных для значения столбца гистограммы: значение должно быть целочисленным или с плавающей запятой. ");
        return;
    }
    if(label.replace(/\s+/g, '') == ''){
        alert("Данные некорректны :не введено название столбца");
        return;
    }
    for (var i = 0; i < myChart.data.labels.length; ++i){
        var a = myChart.data.labels[i];
        if (a == label){
            alert("Данные некорректны : такой столбец уже существует");
            return;
        }

    }
    myChart.data.labels.push(label);
    myChart.data.datasets[0].data.push(value);
    myChart.update();
}

function SaveAsImage(){
    const imageLink = document.createElement('a');
    const histogram = document.getElementById('Histogram');
    imageLink.download = 'histogram.png';
    imageLink.href = histogram.toDataURL('image/png', 1);
    imageLink.click();
}

