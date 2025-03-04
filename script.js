const pianoDisplay = document.getElementById("pianoDisplay");
const shoppingBy = document.getElementById("shopping-by");
const itemsPerPage = 48;
let pianoData = [];
let priceData;
let priceDataIf = false;

// Global filter objects
let pianoType = { select: false, type: "" };
let makerType = { select: false, maker: "" };
let conditionType = { select: false, condition:"" }; 

function updateShoppingByVisibility() {
  const shoppingBy = document.getElementById("shopping-by");
  if (pianoType.select || makerType.select || conditionType.select) {
    shoppingBy.style.display = "flex";
  } else {
    shoppingBy.style.display = "none";
  }
}

function updatePagination(totalItems) {
  const paginationContainer = document.querySelector('.pagination');
  // Clear existing pagination items
  paginationContainer.innerHTML = '';
  const numberOfPages = Math.ceil(totalItems / itemsPerPage);
  
  // If there's only one page, hide the pagination container.
  if (numberOfPages <= 1) {
    paginationContainer.style.display = 'none';
  } else {
    paginationContainer.style.display = 'flex';
    for (let i = 1; i <= numberOfPages; i++) {
      const span = document.createElement('span');
      span.textContent = i;
      // Mark the first page as active
      if (i === 1) {
        span.classList.add('active');
      }
      span.addEventListener('click', function () {
        displayPage(i, pianoData);
        document.getElementById("pianoFilterRight").scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Remove active class from all spans and add it to the clicked one
        paginationContainer.querySelectorAll('span').forEach(s => s.classList.remove('active'));
        this.classList.add('active');
      });
      paginationContainer.appendChild(span);
    }
  }
}

function displayPage(page, data) {
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const currentItems = data.slice(start, end);
  document.getElementById("currentStart").textContent = data.length > 1 ? start + 1 + " - " : "0 - ";
  document.getElementById("currentEnd").textContent = data.length > end ? end : data.length;


  let htmlRows = "";
  // Group items in rows of 3 columns
  for (let i = 0; i < currentItems.length; i += 3) {
    const rowItems = currentItems.slice(i, i + 3);
    const rowHtml = rowItems
      .map(piano => {
        return `
          <div class="col-md-4 d-flex flex-column mb-4 displayed">
            <img class="img-fluid" src="${piano.imagesrc}.jpg" alt="${piano.name}" onerror="this.onerror=null; this.src='${piano.imagesrc}.jpeg';">
            <p>${piano.name}</p>
            <p>${piano.price}</p>
          </div>
        `;
      })
      .join("");
    htmlRows += `<div class="row">${rowHtml}</div>`;
  }
  pianoDisplay.innerHTML = htmlRows;
}

function pianoFilter() {
  fetch("pianos.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => {
      // Start with the full data set
      let filteredData = data;

      // Apply piano type filter if selected
      if (pianoType.select) {
        filteredData = filteredData.filter(piano => piano.type === pianoType.type);
      }

      // Apply manufacturer filter if selected
      if (makerType.select) {
        filteredData = filteredData.filter(piano => piano.manufacturer === makerType.maker);
      }

      // Apply condition filter (used) if selected
      if (conditionType.select) {
        if (conditionType.condition === "new") {
          filteredData = filteredData.filter(piano => piano.used === false || typeof piano.used === "undefined");
        } else if(conditionType.condition === "used"){
          filteredData = filteredData.filter(piano => piano.used === true);
        }        
      }

      
      pianoData = filteredData;
      document.getElementById("totalAmount").textContent = filteredData.length;
      displayPage(1,pianoData);

      // Set up pagination (assuming there are at least 1 page and pagination spans already exist)
      updatePagination(filteredData.length);
    })
    .catch(error => {
      console.error("Error fetching JSON:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  pianoFilter();
  priceDataIf = false;
});


function clearPrices () {
  priceDataIf = false 
  document.getElementById("minPrice").value = ""; 
  document.getElementById("maxPrice").value = "";
 
}
// Example event listeners for filter controls
document.getElementById("pianoTypeClose").addEventListener("click", () => {
  pianoType.select = false;
  pianoType.type = "";
  pianoFilter();
  document.getElementById("pianoType").style.display = "none";
  updateShoppingByVisibility();  
  clearPrices();
});

document.getElementById("grandPiano").addEventListener("click", () => {
  pianoType.select = true;
  pianoType.type = "Grand Piano";
  pianoFilter();
  document.getElementById("pianoType").style.display = "flex";
  document.getElementById("pianoType").style.justifyContent = "space-between";
  document.getElementById("currentType").textContent = "Grand Piano";
  updateShoppingByVisibility();
  clearPrices();
});

document.getElementById("uprightPiano").addEventListener("click", () => {
  pianoType.select = true;
  pianoType.type = "Upright Piano";
  pianoFilter();
  document.getElementById("pianoType").style.display = "flex";
  document.getElementById("pianoType").style.justifyContent = "space-between";
  document.getElementById("currentType").textContent = "Upright Piano";
  updateShoppingByVisibility();
  clearPrices();
});

document.getElementById("digitalPiano").addEventListener("click", () => {
  pianoType.select = true;
  pianoType.type = "Digital Piano";
  pianoFilter();
  document.getElementById("pianoType").style.display = "flex";
  document.getElementById("pianoType").style.justifyContent = "space-between";
  document.getElementById("currentType").textContent = "Digital Piano";
  updateShoppingByVisibility();
  clearPrices();
});

document.querySelectorAll(".brand").forEach(brandEl => {
  brandEl.addEventListener("click", (e) => {
    makerType.select = true;
    makerType.maker = e.target.textContent;
    pianoFilter();
    const makerFilterElem = document.getElementById("makerFilter");
    makerFilterElem.style.display = "flex";
    makerFilterElem.style.justifyContent = "space-between";
    document.getElementById("currentMaker").textContent = makerType.maker;
    updateShoppingByVisibility();
    clearPrices();
  });
});


// And to clear manufacturer filter:
document.getElementById("makerClose").addEventListener("click", () => {
  makerType.select = false;
  makerType.maker = "";
  pianoFilter();
  document.getElementById("makerFilter").style.display = "none";
  updateShoppingByVisibility();
  clearPrices();
});

// For condition filter (Used):
document.getElementById("new").addEventListener("click", () => {
  conditionType.select = true;
  conditionType.condition = "new"
  pianoFilter();
  const conditionFilterElem = document.getElementById("conditionFilter");
  conditionFilterElem.style.display = "flex";
  conditionFilterElem.style.justifyContent = "space-between";
  document.getElementById("currentCondition").textContent = "New";
  updateShoppingByVisibility();
  clearPrices();
});

document.getElementById("used").addEventListener("click", () => {
  conditionType.select = true;
  conditionType.condition = "used"
  pianoFilter();
  const conditionFilterElem = document.getElementById("conditionFilter");
  conditionFilterElem.style.display = "flex";
  conditionFilterElem.style.justifyContent = "space-between";
  document.getElementById("currentCondition").textContent = "Used";
  updateShoppingByVisibility();
  clearPrices();
});

document.getElementById("conditionClose").addEventListener("click", () => {
  conditionType.select = false;
  conditionType.condition = ""
  pianoFilter();
  document.getElementById("conditionFilter").style.display = "none";
  updateShoppingByVisibility();
  clearPrices();
});

// Assuming pianoData is your global (filtered) data array and itemsPerPage is defined

document.addEventListener("DOMContentLoaded", function() {
  const sortSelect = document.getElementById("sort");
  console.log("Sort element:", sortSelect); // Check if it logs the element

    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        console.log("Sort event fired", e.target.value);
        // Place your sorting logic here
        const sortValue = e.target.value;
    console.log("Sorting by:", sortValue);
    let sortedData;

    if (priceDataIf === true) {
      sortedData =[...priceData]
    } else {
      sortedData = [...pianoData];
    }

    if (sortValue === "price-desc") {
      sortedData.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^\d.]/g, ""));
        const priceB = parseFloat(b.price.replace(/[^\d.]/g, ""));
        return priceB - priceA;
      });
    } else if (sortValue === "price-asc") {
      sortedData.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^\d.]/g, ""));
        const priceB = parseFloat(b.price.replace(/[^\d.]/g, ""));
        return priceA - priceB;
      });
    } else if (sortValue === "name-asc") {
      sortedData.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === "name-desc") {
      sortedData.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    console.log("Sorted data:", sortedData.map(p => p.name));
  
    displayPage(1, sortedData);
      });
    } else {
      console.error("Sort element not found!");
    }
});

document.getElementById("priceRangeUpdate").addEventListener("click", () => {
  const minPrice = parseFloat(document.getElementById("minPrice").value) || 0;
  const maxPrice = parseFloat(document.getElementById("maxPrice").value) || Infinity;
  
  // Clone the original data so we don't alter the original dataset
  priceData = [...pianoData];
  
  // Filter the cloned data by price range
  priceData = priceData.filter(piano => {
    const priceNumber = parseFloat(piano.price.replace(/[^\d.]/g, "")) || 0;
    return priceNumber >= minPrice && priceNumber <= maxPrice;
  });
  
  // Update the display based on the filtered data
  document.getElementById("totalAmount").textContent = priceData.length;
  updatePagination(priceData.length);
  displayPage(1, priceData);
  document.getElementById("pianoFilterRight").scrollIntoView({ behavior: 'smooth', block: 'start' });
  priceDataIf = true;
});


const grandLink = document.getElementById("grandPianosLink");
grandLink.addEventListener("click", function(e) {
  e.preventDefault(); // Prevent default navigation
  console.log("grandLink clicked");
  // Redirect to the pianos page
  window.location.href = "pianos.html";
  setTimeout(() => {
    pianoType.select = true;
    pianoType.type = "Grand Piano";
    pianoFilter();
    document.getElementById("pianoType").style.display = "flex";
    document.getElementById("pianoType").style.justifyContent = "space-between";
    document.getElementById("currentType").textContent = "Grand Piano";
    updateShoppingByVisibility();
    clearPrices();
  }),100
});