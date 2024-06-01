document.addEventListener('DOMContentLoaded', () => {
    const foodSelect = document.getElementById('food-select');
    const addFoodButton = document.getElementById('add-food');
    const foodList = document.getElementById('food-list');
    const totalCaloriesElement = document.getElementById('total-calories');
    const caloriesChartCtx = document.getElementById('calories-chart').getContext('2d');

    let foods = [];
    let totalCalories = 0;
    const selectedFoods = [];

    // Fetch food data from a local JSON file
    fetch('foods.json')
        .then(response => response.json())
        .then(data => {
            foods = data;
            populateFoodSelect();
        })
        .catch(error => console.error('Error fetching the food data:', error));

    function populateFoodSelect() {
        foods.forEach(food => {
            const option = document.createElement('option');
            option.value = food.name;
            option.textContent = `${food.name} (${food.calories} cal)`;
            foodSelect.appendChild(option);
        });
    }

    addFoodButton.addEventListener('click', () => {
        const selectedFoodName = foodSelect.value;
        const selectedFood = foods.find(food => food.name === selectedFoodName);

        if (selectedFood) {
            selectedFoods.push(selectedFood);
            updateFoodList();
            updateTotalCalories();
            updateChart();
        }
    });

    function updateFoodList() {
        foodList.innerHTML = '';
        selectedFoods.forEach((food, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${food.name} - ${food.calories} cal`;
            const removeButton = document.createElement('button');
            removeButton.textContent = 'X';
            removeButton.addEventListener('click', () => {
                selectedFoods.splice(index, 1);
                updateFoodList();
                updateTotalCalories();
                updateChart();
            });
            listItem.appendChild(removeButton);
            foodList.appendChild(listItem);
        });
    }

    function updateTotalCalories() {
        totalCalories = selectedFoods.reduce((total, food) => total + food.calories, 0);
        totalCaloriesElement.textContent = totalCalories;
    }

    function updateChart() {
        const labels = selectedFoods.map(food => food.name);
        const data = selectedFoods.map(food => food.calories);

        if (window.caloriesChart) {
            window.caloriesChart.destroy();
        }

        window.caloriesChart = new Chart(caloriesChartCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
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
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }
});
