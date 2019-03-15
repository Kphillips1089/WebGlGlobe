var theGlobe = function() {
    
    // Set default globe options
    var options = {
       zoom: 5,
       position: [38, -94]
   };
    
    // Generate map layer for globe
    map = new WE.map('map', options);
    WE.tileLayer('https://maps.tilehosting.com/styles/hybrid/{z}/{x}/{y}.jpg?key=7XBO3tpqswxaHCrAC36b').addTo(map);
    
    // Initial animation onLoad
    new mapController().panInsideBounds([35, -85], [30, -99], 0, 20, 2);
    
    // Grab drop down menu items
    let dropDown = document.getElementById('map-options');
    
    // Holds coordinates for generating a polygon
    // to test: Can possibly hold var in function, have inner function create the polygon
    var coordsPoly = [];
    
    // Map listens to click events
    map.on('click', function(e) {
        
        // Sets selected drop down menu value
        let dropDownVal = dropDown.options[dropDown.selectedIndex].value
        // Return coordinates when map is clicked
        let coordsClick = new mapController().coordinatesClick(e);
        
        // When map is clicked, calls appropriate function depending on selected drop down item
        if (dropDownVal === "add-marker") {
            new mapController().addMarker(e);
        };
        if (dropDownVal === "remove-marker") {
            new mapController().removeMarker();
        }
        if (dropDownVal === "add-polygon") {
            coordsPoly.push(coordsClick);
            coordsPoly.forEach(function(e) {
                var outputVal = document.getElementById("polyArr").value
                document.getElementById("polyArr").value = `${outputVal} [ ${e} ], ` ;
            });
        }
    });
    
    // Calls functions when run button is clicked
    document.getElementById("run-button").onclick = function() {
        
        // Sets selected drop down menu value
        let dropDownVal = dropDown.options[dropDown.selectedIndex].value
        
        // When run button is clicked, calls appropriate function depending on selected drop down item
        if (dropDownVal === "pan-to") {
            // Grabs all current values from pan-to input boxes and returns them as an array
            let panValues = animationValues();
            new mapController().panInsideBounds(panValues[0], panValues[1], panValues[2], panValues[3], panValues[4]);
        };
        
        if (dropDownVal === "add-polygon") {
            new mapController().addPolygon(coordsPoly);
        };
        
        if (dropDownVal === "rotate-globe") {
            stopGlobe();
        };
    };

};

var mapController = function() {
    
    // Pans-to selected geographic area
    this.panInsideBounds = function(leftCoord, rightCoord, head, til, dur) {
        map.panInsideBounds([leftCoord, rightCoord], {heading: head, tilt: til, duration: dur});
    };
    
    // Returns geographic coordinates when the map is clicked
    this.coordinatesClick = function(e) {
        let coord = e.latlng;
        let lat = coord.lat;
        let lng = coord.lng;
        document.getElementById("lat").value = lat;
        document.getElementById("lon").value = lng;
        return [lat, lng];
    };
    
    // Adds a marker to map when clicked based on geographic coordinates
    this.addMarker = function(e) {
        let marker = new WE.marker(e.latlng).addTo(map);
        let text = document.getElementById("add-marker-text").value;
        if (text !== "") {
            marker.bindPopup(text, {maxWidth: 80, closeButton: true}).openPopup();
        }
    }
    
    // Remove marker does not work.
    // Possibly create an object to hold all marker coordinates, then clear the entire object.
    this.removeMarker = function(e) {
        console.log('This doenst work yet, WE.layerGroup throws error');
    }
    
    // Generates polygon
    // {} can set opacity, fillColor etc.
    // polygon.destroy & removeFrom(map) do not work
    this.addPolygon = function(e) {
        var polygon = WE.polygon(e).addTo(map);
    }
    
};

let globeLoop = 1;
const animateGlobe = () => {
   let before = null;
   requestAnimationFrame( animate = now => {
      let position = map.getPosition();
      let elapsed = before ? now - before : 0;
      before = now;
      map.setCenter([ position[0], position[1] + 0.1 * 0.05 ]);
      (!globeLoop) ? requestAnimationFrame(animate) : cancelAnimationFrame(globeLoop);
   })
}

const stopGlobe = () => (!globeLoop) ? globeLoop = 1 : reactivateGlobe();

const reactivateGlobe = () => {
   globeLoop = undefined; 
   animateGlobe();
}

var animationValues = function() {
    
    // Create variables of for values of pan-to input boxes
    let leftLat = document.getElementById("pan-left-lat").value;
    let leftLon = document.getElementById("pan-left-lon").value;
    let rightLat = document.getElementById("pan-right-lat").value;
    let rightLon = document.getElementById("pan-right-lon").value;
    let heading = document.getElementById("pan-heading").value;
    let tilt = document.getElementById("pan-tilt").value;
    let duration = document.getElementById("pan-duration").value;
    
    // Create arrays for pan-to left and right boundaries
    let leftCoords = [leftLat, leftLon];
    let rightCoords = [rightLat, rightLon];
    
    // Returns array of all needed values for pan-to
    let panToVals = [leftCoords, rightCoords, heading, tilt, duration];
    return panToVals;
}


// jQuery
$(document).ready(function() {
    $('.pan-to-location').hide().addClass('container-style');
    $('.add-marker-container').hide().addClass('container-style');
    $('.rotate-globe-container').hide().addClass('container-style');
    $('.create-polygon-container').hide().addClass('container-style');
});

$(document).ready(function() {
    $('.map-options').on('change', function() {
        if (this.value === 'pan-to') {
            $('.pan-to-location').show('slow');
        } else {
            $('.pan-to-location').hide('slow');
        }
        if (this.value === 'add-marker') {
            $('.add-marker-container').show('slow');
        } else {
            $('.add-marker-container').hide('slow');
        }
        if (this.value === 'rotate-globe') {
            $('.rotate-globe-container').show('slow');
        } else {
            $('.rotate-globe-container').hide('slow');
        }
        if (this.value === 'add-polygon') {
            $('.create-polygon-container').show('slow');
        } else {
            $('.create-polygon-container').hide('slow');
        }
    });
});