/**
*   Title: Influence
*
*   Author:   Andrew Mason
*   Contact:  andrew@coderonfire.com
*
*/

var INFLUENCE = (function() {
	var canvas,
		context,
		width,
		height,
		zoomLevel = 1,
		zoomFactor = 0.1,
        worldOffsetX = 0,
        worldOffsetY = 0,
        nodes = [],
        rad = Math.PI / 180;

	function init() {
		canvas = document.getElementById('gameSurface');
		context = canvas.getContext('2d');
		width = window.innerWidth,
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
        worldOffsetX = width / 2;
        worldOffsetY = height / 2;

        context.strokeStyle = 'rgb(255, 255, 255)';
		context.fillStyle = 'rgb(255, 255, 255)';

		// Set-up events
        var scrollEvent = (window.onmousewheel === null) ? 'mousewheel' : 'DOMMouseScroll';
		window.addEventListener(scrollEvent, zoom, false);
        window.addEventListener('gesturechange', zoom, false);
		window.addEventListener('mousedown', INFLUENCE.Pan.startPan, false);
        window.addEventListener('touchstart', INFLUENCE.Pan.startPan, false);
        window.addEventListener('resize', resizeCanvas, false);

		buildNodes();
        updateNodes();
		renderBox();
	}

	function buildNodes() {
        var i =0,
            nodeCount = 1000;

		for (i = 0; i < nodeCount; i++) {
			var x = Math.random() * (width * 10);
			var y = Math.random() * (height * 10);
			x *= (Math.random() > 0.5) ? 1 : -1;
			y *= (Math.random() > 0.5) ? 1 : -1;

            var node = new INFLUENCE.Node(i, x, y);
            node.addRandomChildren();
			nodes.push(node);
		}

        for (i = 0; i < nodeCount; i++) {
            var connectionCount = Math.floor(Math.random() * 10);
            for (var n = 0; n < connectionCount; n++) {
                var randomNode = Math.floor(Math.random() * nodes.length);
                // Don't add self to following list
                if (nodes[i].id !== randomNode) {
                    nodes[i].addFollower(nodes[randomNode]);
                }
            }

            var influencePower = nodes[i].influenceCount().influenceTotal;
            nodes[i].setInfluence(influencePower);
        }
	}

	function renderBox() {
		context.clearRect(0, 0, width, height);
		
        for (var i = 0, count = nodes.length; i < count; i++) {
            var node = nodes[i];
            var pos = node.getRelativePosition();
            var size = node.getSize();

            // Skip off screen nodes
            if (pos.x < 0 || pos.x > width || pos.y < 0 || pos.y > height) {
                continue;
            }

            // Draw main node
			context.fillRect(
                Math.floor(pos.x),
                Math.floor(pos.y),
                Math.floor(size),
                Math.floor(size)
            );


            // Draw links to influencing nodes
            var following = node.getFollowers();
            var fCount = following.length;

            if (fCount > 0) {
                context.beginPath();
                for (var f = 0; f < fCount; f++) {
                    context.lineWidth = node.getInfluence() / 100;

                    var fPos = following[f].getRelativePosition();
                    context.moveTo(
                        Math.floor(pos.x + size / 2),
                        Math.floor(pos.y + size / 2)
                    );
                    context.lineTo(
                        Math.floor(fPos.x + size / 2),
                        Math.floor(fPos.y + size / 2)
                    );
                }
                context.closePath();
                context.stroke();
            }


            // Draw children
            var childNodes = node.getChildren();
            var segement = 360 / childNodes.length;
            var childSize = (size / 3 > 1) ? Math.floor(size / 3 ) : 1;
            if (childSize === 1) {
                continue;
            }

            context.beginPath();
            for (var n = 0, cCount = childNodes.length; n < cCount; n++) {
                //var childNode = childNodes[n]
                context.lineWidth = 1;
                var radius = 30 * Math.pow(zoomLevel, 2);
                var angle = (n + 1) * segement;

                var lineXLength = Math.floor(Math.sin(rad * angle) * radius);
                var lineYLength = Math.floor(Math.cos(rad * angle) * radius);

                var xpos = lineXLength + pos.x + childSize;
                var ypos = lineYLength + pos.y + childSize;

                var lineX = Math.floor(xpos + childSize / 2);
                var lineY = Math.floor(ypos + childSize / 2);

                // Only draw visible lines
                if (Math.abs(lineXLength + lineYLength) > 2) {
                    context.moveTo(Math.floor(pos.x + size / 2), Math.floor(pos.y + size / 2));
                    context.lineTo(lineX, lineY);
                }

                context.fillRect(
                    Math.floor(xpos),
                    Math.floor(ypos),
                    Math.floor(childSize),
                    Math.floor(childSize)
                );
            }
            context.closePath();
            context.stroke();
		}

        debug();
	}

	function zoom(event) {
        var direction = 1;

        if (event.type === 'mousewheel') {
            direction = event.wheelDeltaY; // Chrome
        } else if (event.scale) {
            direction = event.scale; // Webkit pinch
        } else {
             direction = event.detail * -1; // Firefox
        }

		zoomLevel *= (direction > 0) ? 1 + zoomFactor : 1 - zoomFactor;
        

        updateNodes();
		renderBox();
        event.preventDefault();
	}

	function resizeCanvas(event) {
		width = window.innerWidth,
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
        context.strokeStyle = 'rgb(255, 255, 255)';
		context.fillStyle = 'rgb(255, 255, 255)';
		renderBox();
	}

    function setWorldOffset(x, y) {
        worldOffsetX = x;
        worldOffsetY = y;
    }

    function getWorldOffset() {
        return {
            x: worldOffsetX,
            y: worldOffsetY
        };
    }

    function updateNodes() {
        for (var i = 0, count = nodes.length; i < count; i++) {
            var originalPos = nodes[i].getOriginalPosition();

            var xPos = (originalPos.x + worldOffsetX) * zoomLevel + worldOffsetX;
            var yPos = (originalPos.y + worldOffsetY) * zoomLevel + worldOffsetY;

            var size = 10 * zoomLevel;
            size = (size < 1) ? 1 : size;
            nodes[i].setSize(size);
            nodes[i].setRelativePosition(xPos, yPos);
        }
    }

    function debug() {
        // Debug
        context.fillRect(worldOffsetX, 0, 1, height);
        context.fillRect(0, worldOffsetY, width, 1);
    }

	return {
		init: init,
        renderBox: renderBox,
        setWorldOffset: setWorldOffset,
        getWorldOffset: getWorldOffset,
        updateNodes: updateNodes
	};
}());






INFLUENCE.Pan = (function(){
	var panStartX = 0,
		panStartY = 0,
		panDistanceX = 0,
		panDistanceY = 0,
        currentOffset = {};

	function startPan(event) {
        var pos = {};
        if (event.type === 'touchstart') {
            var touch = event.touches[0] || event.changedTouches[0];
            pos = {
                x: touch.pageX,
                y: touch.pageY
            };
        } else {
            pos = {
                x: event.pageX,
                y: event.pageY
            };
        }

		panStartX = pos.x;
		panStartY = pos.y;
        currentOffset = INFLUENCE.getWorldOffset();

        // Add Event listeners
		window.addEventListener('mousemove', panScreen, false);
        window.addEventListener('touchmove', panScreen, false);
		window.addEventListener('mouseup', stopPan, false);
        window.addEventListener('touchend', stopPan, false);
        
        event.preventDefault();
	}

	function panScreen(event) {
        var pos = {};
        if (event.type === 'touchmove') {
            var touch = event.touches[0] || event.changedTouches[0];
            pos = {
                x: touch.pageX,
                y: touch.pageY
            };
        } else {
            pos = {
                x: event.pageX,
                y: event.pageY
            };
        }

		panDistanceX = currentOffset.x + (pos.x - panStartX);
		panDistanceY = currentOffset.y + (pos.y - panStartY);
        
        INFLUENCE.setWorldOffset(panDistanceX, panDistanceY);
        INFLUENCE.updateNodes();
		INFLUENCE.renderBox();
        event.preventDefault();
	}

	function stopPan() {
        INFLUENCE.setWorldOffset(panDistanceX, panDistanceY);
		window.removeEventListener('mousemove', panScreen, false);
        window.removeEventListener('touchmove', panScreen, false);
		console.log('removed panning');
	}

	return {
		startPan: startPan
	};
}());






INFLUENCE.Node = function(idValue, x, y, initChildren, initParents) {
	var id = idValue,
        influence = 1,
        followers = [],
        originalX = x || 0,
        originalY = y || 0,
        relativeX = x || 0,
        relativeY = y || 0,
        size = 10,
		children = initChildren || [],
		parents = initParents || [];

	function getOriginalPosition() {
		return {
            x: originalX,
            y: originalY
        };
	}

    function getRelativePosition() {
        return {
            x: relativeX,
            y: relativeY
        };
    }

    function getSize() {
        return size;
    }

    function setSize(s) {
        size = s;
    }

    function setInfluence(i) {
        influence = i;
    }

    function getInfluence() {
        return influence;
    }

    function setRelativePosition(x, y) {
        relativeX = x;
        relativeY = y;
    }

	function addChild(childNode) {
		var newChild = childNode || new INFLUENCE.Node(
                null,
				originalX,
				originalY,
				false,
				this
			);
		children.push(newChild);
	}

    function addRandomChildren() {
        var childCount = Math.round((Math.random() * 10) + 1);
        for (var i = 0; i < childCount; i++) {
            addChild();
        }
    }

	function getChildren() {
		return children;
	}

    function getParents() {
        return parents;
    }

    function addFollower(node) {
        followers.push(node);
    }

    function getFollowers() {
        return followers;
    }

    function influenceCount() {
        var nodesCount = {};
        for (var i=0; i < followers.length; i++) {
            var nodeID = followers[i].id;

            if (typeof nodesCount[nodeID] === 'undefined') {
                nodesCount[nodeID] = 1;
            } else {
                nodesCount[nodeID] += 1;
            }

            var nodesFollowers = followers[i].getFollowers();

            for (var n = 0; n < nodesFollowers.length; n++) {
                var nodeID2 = nodesFollowers[n].id;

                if (typeof nodesCount[nodeID2] === 'undefined') {
                    nodesCount[nodeID2] = 1;
                } else {
                    nodesCount[nodeID2] += 1;
                }
            }
        }

        var cnt = 0;
        var influenceTotal = 0;
        for (var key in nodesCount) {
            cnt++;
            influenceTotal += nodesCount[key];
        }

        return {
            nodecount: nodesCount,
            count: cnt,
            influenceTotal: influenceTotal
        };
    }

	return {
		getOriginalPosition: getOriginalPosition,
        getRelativePosition: getRelativePosition,
        setRelativePosition: setRelativePosition,
		addChild: addChild,
		getChildren: getChildren,
        getParents: getParents,
        getSize: getSize,
        setSize: setSize,
        addRandomChildren: addRandomChildren,
        addFollower: addFollower,
        getFollowers: getFollowers,
        influenceCount: influenceCount,
        setInfluence: setInfluence,
        getInfluence: getInfluence
	};
};

INFLUENCE.init();
