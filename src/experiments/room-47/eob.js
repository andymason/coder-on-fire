/*
	Google query: intitle:"Network Camera" inurl:ViewerFrame  inurl:mode +pan +tilt

	params:
		Resolution = 640x480, 320x240, 160x120
		Quality = Clarity, Standard, Motion
		Interval = 10, 30

		PresetOperation = Move
		Language = 0, 1, 2, 3
		Mode = Refresh
		Size = STD, Expand
		Direction = DefaultBrightness, Brighter, Darker

		Image path: /nphMotionJpeg
		Control path: /ViewerFrame
*/

var eob = (function() {
	// All links taken from Goolge
	var feeds = [
		'http://209.50.106.51:8181/',
		'http://collegio-cam.pittstate.edu/',
		'http://133.64.28.44/',
		'http://61.119.240.67/',
		'http://65.74.44.104:82/',
		'http://62.117.68.199:8055/',
		'http://hvmmarinacam.viewnetcam.com:60030/',
		'http://83.104.226.142/',
		'http://65.74.44.104:81/',
		'http://61.115.119.138:84/',
		'http://219.127.83.130/',
		'http://cablenic.glaztech.com:81/',
		'http://74.93.223.153:81/',
		'http://83.232.151.17/',
		'http://118.243.10.93:82/',
		'http://203.141.133.252:8080/',
		'http://219.121.6.216:8080/',
		'http://72.236.125.34:215/',
		'http://12.184.110.78:8186/',
		'http://210.225.76.6:60001/',
		'http://188.181.46.116:82/',
		'http://212.96.169.238/',
		'http://83.232.94.52:81/',
		'http://81.72.162.170/',
		'http://thegetaway.no-ip.com:6013/',
		'http://210.172.213.198/',
		'http://218.225.172.199:8080/',
		'http://219.117.238.34:1214/',
		'http://203.135.195.33/',
		'http://219.162.124.206:82/',
		'http://61.115.121.38/',
		'http://210.175.242.113/',
		'http://210.230.248.83:82/',
		'http://175.176.197.24/',
		'http://arasimadake.plala.jp:8000/',
		'http://60.45.180.146:8081/',
		'http://203.135.231.172:8080/',
		'http://219.114.70.205:83/',
		'http://60.33.108.92/',
		'http://220.110.180.230/',
		'http://beausoft.atnz.net/',
		'http://67.53.90.118/',
		'http://75.145.222.133:7501/',
		'http://133.80.191.122/',
		'http://121.1.132.197:8080/',
		'http://202.212.193.26:90/',
		'http://211.2.179.199/',
		'http://210.134.88.164:82/',
		'http://saltydogs.dyndns.tv/',
		'http://panorama-camera.city.shiojiri.nagano.jp/',
		'http://ipc_torigiku01.fip.nk.dococame.com:82/',
		'http://173.248.230.248:8888/',
		'http://60.37.111.190:8088/',
		'http://121.1.246.114:81/',
		'http://211.129.122.20/',
		'http://sanyo-fk.aa0.cdl1.careplus.jp/',
		'http://219.160.180.45:83/',
		'http://203.189.38.246/',
		'http://218.251.123.27/',
		'http://219.166.228.58/',
		'http://truckeewebcam.gotdns.com/',
		'http://61.211.241.239/',
		'http://202.237.55.63/',
		'http://220.254.124.250/',
		'http://69.9.192.175/',
		'http://24.97.25.202:8883/',
		'http://125.175.107.24/',
		'http://gocanaria.ath.cx:8000/',
		'http://apple-cam.miemasu.net/',
		'http://12.184.110.78:8186/',
		'http://81.72.162.170/',
		'http://websitecam91110.viewnetcam.com/',
		'http://210.172.213.198/',
		'http://219.117.238.34:1214/',
		'http://219.162.124.206:82/',
		'http://175.176.197.24/',
		'http://61.119.240.67/',
		'http://219.127.83.130/',
		'http://75.145.222.133:7505/',
		'http://219.114.70.134:82/',
		'http://180.148.197.212:81/',
		'http://camera.16g.jp/',
		'http://134.154.209.236/',
		'http://cam147645.miemasu.net/',
		'http://koduka-isogo.aa0.netvolante.jp:82/',
		'http://sansuikan.dyndns.org:9005/',
		'http://209.50.106.51:8181/',
		'http://zerokewl1970.dyndns.info:8953/',
		'http://210.154.21.195/',
		'http://makeit-dhstore-hamamatsu.miemasu.net:83/'
	];
	var wrapper = document.getElementById('bedroom');
	var usedTVs = [];

	for (var i = 0; i < 20; i++) {
		var randomFeed = getRandomFeed(feeds);
		var TV = createTV(randomFeed.feed, i, randomFeed.index);
	
		wrapper.appendChild(TV);
		usedTVs.push([TV, randomFeed]);
	}

	function getRandomFeed(feeds) {
		var rndIndex = Math.floor(feeds.length * Math.random());
		return {
            feed: feeds.splice(rndIndex, 1),
            index: rndIndex
        };
	}

	function replaceTV(index) {
		var oldTV = usedTVs[index][0];
		var oldFeed = usedTVs[index][1];
		var randomFeed = getRandomFeed(feeds).feed;
		var video = oldTV.getElementsByTagName('img')[0];

		oldTV.setAttribute('href', linkSignal(randomFeed));
		video.setAttribute('src', videoSignal(randomFeed));
        
        if (usedTVs[index][1]) {
            feeds.push(usedTVs[index][1]);
        }
		usedTVs[index][1] = randomFeed;

		setTimeout(turnTVOn(video), 2000);
	}

	function createTV(signal, tvPos, feedIndex) {
		var link = document.createElement('a');
		link.setAttribute('class', 'monitor');
		link.setAttribute('target', '_blank')
		link.setAttribute('title', 'TAKE CONTROL')
		link.setAttribute('href', linkSignal(signal));
		
		var img = document.createElement('img');
		img.setAttribute('src', videoSignal(signal));
		img.setAttribute('width', 160);
		img.setAttribute('height', 0);
		img.style.top = '60px';
        
        var tvPos = tvPos;
        var feedIndex = feedIndex;
        img.onerror = function() {
            usedTVs[tvPos][1] = false
            replaceTV(tvPos);
        }

		var span = document.createElement('span');
		span.setAttribute('class', 'static');
		
		link.appendChild(span);
		link.appendChild(img);

		return link;
	}

	function videoSignal(source) {
		var signal = source +
			'nphMotionJpeg?' +
			'Resolution=160x120&' +
			'Quality=Motion';
		return signal;
	}

	function linkSignal(source) {
		var href = source +
			'ViewerFrame?' +
			'Mode=Refresh&' +
			'Resolution=640x480&' +
			'Quality=Standard&' +
			'PresetOperation=Move';
		return href;
	}
	
	powerUp(usedTVs);

	function powerUp(TVs) {
		for(var i = 0; i < TVs.length; i++) {
			var video = TVs[i][0].getElementsByTagName('img')[0];
			var randDelay = Math.floor(4000 * Math.random());
			setTimeout(turnTVOn(video), 1000 + randDelay);
		}
	}
	function turnTVOn(TV) {
		return function() {
			var tick = setInterval(function(){
				if (parseInt(TV.height) < 120) {
					TV.height += 20;
					TV.style.top = (parseInt(TV.style.top) - 10) + 'px';
				} else {
					TV.height = 120;
					TV.style.top = 0;
					clearInterval(tick);
				}
			}, 1000/30);
		}
	}

	function switchChannels() {
		var rndTV = Math.floor(usedTVs.length * Math.random());
		turnTVOff(rndTV)
	}

	function turnTVOff(TVIndex) {
		var oldTV = usedTVs[TVIndex][0].getElementsByTagName('img')[0];
        console.log(oldTV);

		if (parseInt(oldTV.height) < 120) {
			return;
		}

		var tick = setInterval(function(){
			if (parseInt(oldTV.height)> 0) {
				oldTV.height -= 20;
				oldTV.style.top = (parseInt(oldTV.style.top) + 10) + 'px';
			} else {
				oldTV.height = 0;
				oldTV.style.top = 60;
				clearInterval(tick);
				replaceTV(TVIndex)
			}
		}, 1000/30);
	}

	setInterval(switchChannels, 10000);

	var timeElm = document.getElementById('time');
	function updateTime() {
		timeElm.innerHTML = new Date();
	}
	updateTime();
	setInterval(updateTime, 1000);
}());
