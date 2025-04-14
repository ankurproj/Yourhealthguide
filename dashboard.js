// Health Data
const healthData = {
    diabetes: {
        'all': {
            delhi: { male: 12.5, female: 15.1, other: 13.8 },
            mumbai: { male: 11.2, female: 13.6, other: 12.4 },
            bangalore: { male: 10.5, female: 12.9, other: 11.7 },
            chennai: { male: 11.8, female: 14.2, other: 13.0 },
            kolkata: { male: 13.2, female: 15.8, other: 14.5 }
        },
        '18-25': {
            delhi: { male: 7.2, female: 9.2, other: 8.2 },
            mumbai: { male: 6.5, female: 8.5, other: 7.5 },
            bangalore: { male: 5.8, female: 7.8, other: 6.8 },
            chennai: { male: 6.9, female: 8.9, other: 7.9 },
            kolkata: { male: 8.1, female: 10.1, other: 9.1 }
        },
        '26-35': {
            delhi: { male: 9.5, female: 11.5, other: 10.5 },
            mumbai: { male: 8.8, female: 10.8, other: 9.8 },
            bangalore: { male: 7.9, female: 9.9, other: 8.9 },
            chennai: { male: 9.2, female: 11.2, other: 10.2 },
            kolkata: { male: 10.8, female: 12.8, other: 11.8 }
        },
        '36-45': {
            delhi: { male: 13.2, female: 15.2, other: 14.2 },
            mumbai: { male: 11.5, female: 13.5, other: 12.5 },
            bangalore: { male: 10.8, female: 12.8, other: 11.8 },
            chennai: { male: 12.1, female: 14.1, other: 13.1 },
            kolkata: { male: 14.2, female: 16.2, other: 15.2 }
        },
        '46-55': {
            delhi: { male: 15.8, female: 17.8, other: 16.8 },
            mumbai: { male: 14.2, female: 16.2, other: 15.2 },
            bangalore: { male: 13.5, female: 15.5, other: 14.5 },
            chennai: { male: 14.9, female: 16.9, other: 15.9 },
            kolkata: { male: 16.5, female: 18.5, other: 17.5 }
        },
        '56+': {
            delhi: { male: 17.5, female: 19.5, other: 18.5 },
            mumbai: { male: 16.2, female: 18.2, other: 17.2 },
            bangalore: { male: 15.8, female: 17.8, other: 16.8 },
            chennai: { male: 16.9, female: 18.9, other: 17.9 },
            kolkata: { male: 18.2, female: 20.2, other: 19.2 }
        }
    },
    stress: {
        male: {
            '18-25': 62,
            '26-35': 69,
            '36-45': 65,
            '46-55': 58,
            '56+': 52
        },
        female: {
            '18-25': 68,
            '26-35': 75,
            '36-45': 71,
            '46-55': 64,
            '56+': 58
        },
        other: {
            '18-25': 70,
            '26-35': 73,
            '36-45': 69,
            '46-55': 63,
            '56+': 57
        }
    },
    mental: {
        '18-25': {
            male: 12.5,
            female: 15.8,
            other: 18.2
        },
        '26-35': {
            male: 14.8,
            female: 17.9,
            other: 20.1
        },
        '36-45': {
            male: 16.2,
            female: 19.5,
            other: 21.8
        },
        '46-55': {
            male: 17.5,
            female: 20.8,
            other: 23.1
        },
        '56+': {
            male: 18.8,
            female: 22.1,
            other: 24.4
        }
    }
};

// Chart initialization
let healthChart;
const ctx = document.getElementById('healthChart').getContext('2d');

// Filter elements
const dataTypeSelect = document.getElementById('dataType');
const ageGroupSelect = document.getElementById('ageGroup');
const citySelect = document.getElementById('city');
const genderSelect = document.getElementById('gender');

// Set default values
dataTypeSelect.value = 'diabetes';
ageGroupSelect.value = '26-35';
citySelect.value = 'all';
genderSelect.value = 'all';

// Update chart based on filters
function updateChart() {
    const dataType = dataTypeSelect.value;
    const ageGroup = ageGroupSelect.value;
    const city = citySelect.value;
    const gender = genderSelect.value;

    let labels = [];
    let data = [];
    let backgroundColor = [];
    let borderColor = [];
    let chartType = 'bar';
    let title = '';

    // Get filtered data based on selections
    if (dataType === 'diabetes') {
        if (city === 'all') {
            // Show all cities for selected age group and gender
            const ageData = healthData.diabetes[ageGroup];
            labels = Object.keys(ageData).map(city => city.charAt(0).toUpperCase() + city.slice(1));
            if (gender === 'all') {
                // Show average for all genders
                data = Object.values(ageData).map(cityData => {
                    const sum = Object.values(cityData).reduce((acc, val) => acc + val, 0);
                    return sum / Object.keys(cityData).length;
                });
                title = `Average Diabetes Prevalence by City (Age Group: ${ageGroup})`;
            } else {
                data = Object.values(ageData).map(cityData => cityData[gender]);
                title = `Diabetes Prevalence by City (Age Group: ${ageGroup}, Gender: ${gender})`;
            }
        } else {
            // Show selected city across all age groups for selected gender
            if (ageGroup === 'all') {
                // Show average for all age groups
                const allAges = Object.keys(healthData.diabetes).filter(age => age !== 'all');
                if (gender === 'all') {
                    const cityData = allAges.map(age => {
                        const cityGenderData = healthData.diabetes[age][city];
                        const sum = Object.values(cityGenderData).reduce((acc, val) => acc + val, 0);
                        return sum / Object.keys(cityGenderData).length;
                    });
                    const average = cityData.reduce((sum, val) => sum + val, 0) / cityData.length;
                    labels = ['Average'];
                    data = [average];
                    title = `Average Diabetes Prevalence in ${city.charAt(0).toUpperCase() + city.slice(1)}`;
                } else {
                    const cityData = allAges.map(age => healthData.diabetes[age][city][gender]);
                    const average = cityData.reduce((sum, val) => sum + val, 0) / cityData.length;
                    labels = ['Average'];
                    data = [average];
                    title = `Average Diabetes Prevalence in ${city.charAt(0).toUpperCase() + city.slice(1)} (Gender: ${gender})`;
                }
            } else {
                // Show data for specific age group and gender
                if (gender === 'all') {
                    const cityGenderData = healthData.diabetes[ageGroup][city];
                    const sum = Object.values(cityGenderData).reduce((acc, val) => acc + val, 0);
                    const average = sum / Object.keys(cityGenderData).length;
                    labels = [ageGroup];
                    data = [average];
                    title = `Average Diabetes Prevalence in ${city.charAt(0).toUpperCase() + city.slice(1)} (Age: ${ageGroup})`;
                } else {
                    labels = [ageGroup];
                    data = [healthData.diabetes[ageGroup][city][gender]];
                    title = `Diabetes Prevalence in ${city.charAt(0).toUpperCase() + city.slice(1)} (Age: ${ageGroup}, Gender: ${gender})`;
                }
            }
        }
        backgroundColor = gender === 'male' ? 'rgba(54, 162, 235, 0.5)' : 
                         gender === 'female' ? 'rgba(255, 99, 132, 0.5)' : 
                         'rgba(75, 192, 192, 0.5)';
        borderColor = gender === 'male' ? 'rgba(54, 162, 235, 1)' : 
                     gender === 'female' ? 'rgba(255, 99, 132, 1)' : 
                     'rgba(75, 192, 192, 1)';
    } else if (dataType === 'stress') {
        if (gender === 'all') {
            // Show stress levels for all genders
            labels = Object.keys(healthData.stress.male);
            data = [
                Object.values(healthData.stress.male),
                Object.values(healthData.stress.female),
                Object.values(healthData.stress.other)
            ];
            title = 'Stress Levels by Age Group and Gender';
            backgroundColor = ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(75, 192, 192, 0.5)'];
            borderColor = ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'];
        } else {
            // Show stress levels for selected gender
            labels = Object.keys(healthData.stress[gender]);
            data = Object.values(healthData.stress[gender]);
            title = `Stress Levels by Age Group (${gender.charAt(0).toUpperCase() + gender.slice(1)})`;
            backgroundColor = gender === 'male' ? 'rgba(54, 162, 235, 0.5)' : 
                             gender === 'female' ? 'rgba(255, 99, 132, 0.5)' : 
                             'rgba(75, 192, 192, 0.5)';
            borderColor = gender === 'male' ? 'rgba(54, 162, 235, 1)' : 
                         gender === 'female' ? 'rgba(255, 99, 132, 1)' : 
                         'rgba(75, 192, 192, 1)';
        }
        chartType = 'line';
    } else if (dataType === 'mental') {
        if (ageGroup === 'all') {
            // Show average across all age groups by gender
            const allAges = Object.keys(healthData.mental);
            const genders = ['male', 'female', 'other'];
            labels = genders.map(g => g.charAt(0).toUpperCase() + g.slice(1));
            data = genders.map(gender => {
                const sum = allAges.reduce((acc, age) => acc + healthData.mental[age][gender], 0);
                return sum / allAges.length;
            });
            title = 'Average Mental Disorder Prevalence by Gender';
        } else {
            // Show data for selected age group by gender
            const ageData = healthData.mental[ageGroup];
            labels = Object.keys(ageData).map(g => g.charAt(0).toUpperCase() + g.slice(1));
            data = Object.values(ageData);
            title = `Mental Disorder Prevalence by Gender (Age: ${ageGroup})`;
        }
        backgroundColor = [
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(75, 192, 192, 0.5)'
        ];
        borderColor = [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)'
        ];
        chartType = 'pie';
    }

    // Update chart
    if (healthChart) {
        healthChart.destroy();
    }

    healthChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: Array.isArray(data[0]) ? [
                {
                    label: 'Male',
                    data: data[0],
                    backgroundColor: backgroundColor[0],
                    borderColor: borderColor[0],
                    borderWidth: 1
                },
                {
                    label: 'Female',
                    data: data[1],
                    backgroundColor: backgroundColor[1],
                    borderColor: borderColor[1],
                    borderWidth: 1
                },
                {
                    label: 'Other',
                    data: data[2],
                    backgroundColor: backgroundColor[2],
                    borderColor: borderColor[2],
                    borderWidth: 1
                }
            ] : [{
                label: title,
                data: data,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: dataType === 'diabetes' ? 'Prevalence (%)' : 
                              dataType === 'stress' ? 'Stress Level' : 
                              'Prevalence (%)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: dataType === 'diabetes' ? 'City' : 
                              dataType === 'stress' ? 'Age Group' : 
                              'Gender'
                    }
                }
            }
        }
    });

    // Update summary and insights
    updateSummary(dataType, ageGroup, city, gender);
}

// Update summary and insights
function updateSummary(dataType, ageGroup, city, gender) {
    const dataSummary = document.getElementById('dataSummary');
    const keyInsights = document.getElementById('keyInsights');

    let summary = '';
    let insights = '';

    if (dataType === 'diabetes') {
        const cityName = city === 'all' ? 'all cities' : city.charAt(0).toUpperCase() + city.slice(1);
        const ageGroupText = ageGroup === 'all' ? 'all age groups' : ageGroup;
        const genderText = gender === 'all' ? 'all genders' : gender.charAt(0).toUpperCase() + gender.slice(1);
        summary = `Showing diabetes prevalence data for ${cityName} in the ${ageGroupText} age group for ${genderText}.`;
        
        insights = 'Key insights:\n' +
            '- Females show higher prevalence rates than males\n' +
            '- Other gender shows intermediate prevalence rates\n' +
            '- Higher prevalence in older age groups\n' +
            '- Urban areas show higher rates\n' +
            '- Lifestyle factors play a significant role';
    } else if (dataType === 'stress') {
        const genderText = gender === 'all' ? 'all genders' : gender.charAt(0).toUpperCase() + gender.slice(1);
        summary = `Showing stress levels for ${genderText} across different age groups.`;
        
        insights = 'Key insights:\n' +
            '- Females report higher stress levels than males\n' +
            '- Other gender shows intermediate stress levels\n' +
            '- Peak stress levels in 26-35 age group\n' +
            '- Work-life balance is a major factor\n' +
            '- Gender differences in stress coping mechanisms';
    } else if (dataType === 'mental') {
        const ageGroupText = ageGroup === 'all' ? 'all age groups' : ageGroup;
        summary = `Showing mental disorder prevalence for ${ageGroupText} by gender.`;
        
        insights = 'Key insights:\n' +
            '- Females show higher prevalence rates than males\n' +
            '- Other gender shows highest prevalence rates\n' +
            '- Higher prevalence in younger age groups\n' +
            '- Gender differences in disorder types\n' +
            '- Social stigma affects reporting rates';
    }

    dataSummary.textContent = summary;
    keyInsights.textContent = insights;
}

// Event listeners for filters
dataTypeSelect.addEventListener('change', updateChart);
ageGroupSelect.addEventListener('change', updateChart);
citySelect.addEventListener('change', updateChart);
genderSelect.addEventListener('change', updateChart);

// Initial chart load
updateChart(); 