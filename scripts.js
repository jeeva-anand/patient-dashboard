'use strict';

let username = 'coalition';
let password = 'skills-test';
let auth = btoa(`${ username }:${ password }`);
let localData = {};



// var style = document.getElementsByTagName('style');
// style.type = 'text/css';
// style.innerHTML = '.patient-info { color: #f00; }';

// document.getElementsByTagName('div')[0].appendChild(style);


// document.getElementById('div').className = 'patient-info';

fetch('https://fedskillstest.coalitiontechnologies.workers.dev', {
    method: 'GET',
    headers: {
        'Authorization': `Basic ${ auth }`,
        'Content-Type': 'application/json'
    }
})
    .then(response =>
    {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        if (response.ok)
        {
            return response.json();
        } else
        {
            return response.text().then(text =>
            {
                throw new Error(`Error ${ response.status }: ${ text }`);
            });
        }
    })
    .then(data =>
    {
        console.log('Data received:', data);

        function formatDOB(dobString)
        {
            const months = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            // Split the input string into components
            const [month, day, year] = dobString.split('/');

            // Convert the month number to the month name
            const monthName = months[parseInt(month, 10) - 1];

            // Return the formatted date
            return `${ monthName } ${ parseInt(day, 10) }, ${ year }`;
        }
        

        document.getElementById('profile-picture').src = data[3].profile_picture;
        document.getElementById('name').textContent = data[3].name;

        document.getElementById('dob').textContent = formatDOB(data[3].date_of_birth);
        document.getElementById('gender').textContent = data[3].gender;
        document.getElementById('phone').textContent = data[3].phone_number;
        document.getElementById('emergency-contact').textContent = data[3].emergency_contact;
        document.getElementById('insurance').textContent = data[3].insurance_type;
        document.getElementById('resRate').textContent = data[3].diagnosis_history[0].respiratory_rate['value'];
        document.getElementById('temp').textContent = data[3].diagnosis_history[0].temperature['value'];
        document.getElementById('heartRate').textContent = data[3].diagnosis_history[1].heart_rate['value'];
        document.getElementById('heart_levels').textContent = data[3].diagnosis_history[1].heart_rate['levels'];
        document.getElementById('temp_level').textContent = data[3].diagnosis_history[1].temperature['levels'];
        document.getElementById('resRate_level').textContent = data[3].diagnosis_history[1].respiratory_rate['levels'];






        var d = document,
            pro_info = d.getElementById('pro_info');
        var ul = d.getElementById('pat_list');

        pro_info.className = "pro_info";
        ul.className = "patient-list"



        for (var i = 0; i < data.length; i++)
        {
            var li = d.createElement('li');
            li.className = "lists";

            console.log("list", li.accessKey)
            var img = d.createElement('img');
            var patient_info = d.createElement('div');
            var pat_data = d.createElement('div');
            pat_data.className = "pat_data";
            var pat_name = d.createElement('h3');
            pat_name.className = "pat_name";
            var pat_gen = d.createElement('p');
            var pat_age = d.createElement('p');
            pat_gen.className = "pat_gen";
            pat_age.className = "pat_age";




            img.src = data[i].profile_picture;

            pat_name.textContent = data[i].name;
            pat_gen.textContent = data[i].gender;
            pat_age.textContent = data[i].age;

            patient_info.appendChild(pat_name);
            pat_data.appendChild(pat_gen);
            pat_data.appendChild(pat_age);
            patient_info.appendChild(pat_data)


            li.appendChild(img);
            li.appendChild(patient_info);

            ul.appendChild(li);

        }
        pro_info.appendChild(ul);



        let label = 0;
        let sc = 0;
        let dc = 0;

        let tempData = data[3].diagnosis_history;
        console.log("temp", tempData)

        const monthMap = {
            'January': 1,
            'February': 2,
            'March': 3,
            'April': 4,
            'May': 5,
            'June': 6,
            'July': 7,
            'August': 8,
            'September': 9,
            'October': 10,
            'November': 11,
            'December': 12
        };

        // Sort the API response by year and month
        tempData.sort((a, b) =>
        {
            if (a.year !== b.year)
            {
                return a.year - b.year;
            } else
            {
                return monthMap[a.month] - monthMap[b.month];
            }
        });

        // Get the latest date in the data
        const latestDate = new Date(tempData[tempData.length - 1].year, monthMap[tempData[tempData.length - 1].month] - 1);

        // Get the date six months before the latest date
        const sixMonthsAgo = new Date(latestDate);
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

        // Filter the data to get the last six months
        const lastSixMonthsData = tempData.filter(entry =>
        {
            const entryDate = new Date(entry.year, monthMap[entry.month] - 1);
            return entryDate >= sixMonthsAgo;
        });


        const labels = lastSixMonthsData.map(entry => `${ entry.month.substring(0, 3) }, ${ entry.year }`);
        const systolicData = lastSixMonthsData.map(entry => entry.blood_pressure.systolic.value);
        const diastolicData = lastSixMonthsData.map(entry => entry.blood_pressure.diastolic.value);

        console.log("systolicData", systolicData)
        console.log("diastolicData", diastolicData)
        console.log("labels", labels)


        const ctx = document.getElementById('bloodPressureChart').getContext('2d');
        const bloodPressureChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "systolic",
                        data: systolicData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 2,
                        fill: false,
                        pointBackgroundColor: 'rgba(255, 99, 132, 2)',
                        pointBorderColor: 'rgba(255, 99, 132, 2)',
                        tension: 0.5
                    },
                    {
                        label: "diastolic",
                        data: diastolicData,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 2,
                        fill: false,
                        pointBackgroundColor: 'rgba(54, 162, 235, 2)',
                        pointBorderColor: 'rgba(54, 162, 235, 2)',
                        tension: 0.5
                    }
                ]
            },
            options: {

                scales: {
                    y: {
                        beginAtZero: false,
                        suggestedMin: 60,
                        suggestedMax: 180,
                        // ticks: {
                        //     maxTicksLimit: 20 // Reduce the number of ticks on the y-axis
                        // }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        labels: {
                            color: '#333',
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context)
                            {
                                let label = context.dataset.label || '';
                                if (label)
                                {
                                    label += ': ';
                                }
                                label += context.parsed.y;
                                return label;
                            }
                        }
                    }
                },
                responsive: false,
                maintainAspectRatio: true
            }
        });


        let tag = false;
        function createDataElement(label, value, status)
        {
            const container = document.createElement('div');
            container.className = 'data-item';



            const samllCon = document.createElement('div');
            container.className = 'small' + label;

            const design = document.createElement('span');
            design.className = "design" + label
            design.textContent = "";
            samllCon.appendChild(design);


            const labelSpan = document.createElement('span');
            labelSpan.className = label.toLowerCase();
            labelSpan.textContent = label;
            samllCon.appendChild(labelSpan);

            container.appendChild(samllCon);


            const subSetction = document.createElement('div');
            subSetction.className = 'subSetction';

            const valueSpan = document.createElement('span');
            valueSpan.className = 'value';
            valueSpan.textContent = value;
            subSetction.appendChild(valueSpan,label);

            const statusSpan = document.createElement('span');
            const level = document.createElement('i');

            level.className = checkType(value,label);
            
            

            statusSpan.className = 'status';
            
            // statusSpan.textContent = ""; 
            statusSpan.textContent = status; 
            
            statusSpan.appendChild(level);
            level.style = "padding-left:10px";
            

            subSetction.appendChild(statusSpan);


            container.appendChild(subSetction);



            return container;
        }


        function checkType(value, type)
        {
            if (type === 'Systolic')
            {
                return value > 120 ? 'fa fa-caret-down' : 'fa fa-caret-up';
            } else if (type === 'Diastolic')
            {
                return value > 80 ? 'fa fa-caret-down' : 'fa fa-caret-up';
            }
        }

        function determineStatus(value,type)
        {
            if (type === 'Systolic')
            {
                return value > 120 ? 'Higher than Average' : 'Lower than Average';
            } else if (type === 'Diastolic')
            {
                return value > 80 ? 'Higher than Average' : 'Lower than Average';
            }
        }


        const latestData = lastSixMonthsData[lastSixMonthsData.length - 1];
        console.log("latestData", latestData)


        const systolicElement = createDataElement('Systolic', latestData.blood_pressure.systolic.value, determineStatus(latestData.blood_pressure.systolic, 'Systolic'));
        document.getElementById('dataContainer').appendChild(systolicElement);


        const hr = document.createElement('hr');
        const cont = document.getElementById('dataContainer');
        cont.appendChild(hr);

        const diastolicElement = createDataElement('Diastolic', latestData.blood_pressure.diastolic.value, determineStatus(latestData.blood_pressure.diastolic, 'Diastolic'));
        document.getElementById('dataContainer').appendChild(diastolicElement);


    })
    .catch(error =>
    {
        console.error('Error fetching profile data:', error);
    });






console.log(localData)
