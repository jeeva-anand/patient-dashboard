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

        document.getElementById('profile-picture').src = data[3].profile_picture;
        document.getElementById('name').textContent = data[3].name;
        document.getElementById('dob').textContent = data[3].date_of_birth;
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
        
        const labels = tempData.map(entry => `${ entry.month }, ${ entry.year }`);
        const systolicData = tempData.map(entry => entry.blood_pressure.systolic.value);
        const diastolicData = tempData.map(entry => entry.blood_pressure.diastolic.value);

        const ctx = document.getElementById('bloodPressureChart').getContext('2d');
        const bloodPressureChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'stolic',
                        data: systolicData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderWidth: 2,
                        fill: false,
                        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                        pointBorderColor: 'rgba(255, 99, 132, 1)',
                        tension: 0.1
                    },
                    {
                        label: 'Diastolic',
                        data: diastolicData,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderWidth: 2,
                        fill: false,
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                        pointBorderColor: 'rgba(54, 162, 235, 1)',
                        tension: 0.1
                    }
                ]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        min: 60,
                        max: 180,
                        ticks: {
                            maxTicksLimit: 5 // Reduce the number of ticks on the y-axis
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
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


    })
    .catch(error =>
    {
        console.error('Error fetching profile data:', error);
    });



       
    

console.log(localData)
