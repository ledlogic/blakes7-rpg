/* st-char.js */

st.character = {
	spec: {},
	relStat: {},
	init: function() {
		st.log("init character");
	},
	loadChar: function(uri) {
		st.log("loading char uri[" + uri + "]");
		if (uri.indexOf("dynamic") > -1) {
			st.dynamic.loadChar(uri);
		}
		if (uri.indexOf(".html") > -1) {
			window.location = uri;
		}
		if (uri.indexOf(".csv") > -1) {
			st.character.loadCharCsv(uri);
		}
	},
	loadCharCsv: function(uri) {
		st.log("loading char from csv, uri[" + uri + "]");
		
		var uriArr = uri.split(":");
		var csv = uriArr[0];
		var n = uriArr[1];
		
		Papa.parse("csv/char/" + csv, {
			delimiter: ",",
			download: true,
			header: true,
			complete: function(d) {
				st.character.charResponse(d,n);
			},
			encoding: "UTF-8"
		});
	},
	loadDefaultCsv: function(uri) {
		st.log("loading default char from csv, uri[" + uri + "]");
		
		var uriArr = uri.split(":");
		var csv = uriArr[0];
		var n = uriArr[1];
		
		Papa.parse("csv/char/" + csv, {
			delimiter: ",",
			download: true,
			header: true,
			complete: function(d) {
				st.dynamic.charResponse(d,n);
			},
			encoding: "UTF-8"
		});
	},
	calcHp: function() {
		var spec = st.character.spec;
		
		var str = parseInt(spec.attributes["str"], 10);
		var siz = parseInt(spec.attributes["siz"], 10);
		var end = parseInt(spec.attributes["end"], 10);
		
		var hp = Math.ceil((str + siz + end) / 3.0 + 10);
		return hp;
	},
	calcHth: function() {
		var spec = st.character.spec;
		
		var str = parseInt(spec.attributes["str"], 10);
		var siz = parseInt(spec.attributes["siz"], 10);
		var tot = str + siz;
		
		var hth = 0;
		
		switch (true) {
			case tot <= 6:
				hth = -1;
				break;
			case tot <= 12:
				hth = 0;
				break;
			case tot <= 20:
				hth = 1;
				break;
			case tot <= 32:
				hth = 2;
				break;
			default:
				hth = 3;
				break;
		}
		
		return hth;	
	},
	calcLoad: function() {
		var spec = st.character.spec;
		
		var str = parseInt(spec.attributes["str"], 10);
		var end = parseInt(spec.attributes["end"], 10);
		var loadkg = str + end;
		var loadlb = Math.round(loadkg * 2.20462);
		
		var ret = loadkg + " kg (" + loadlb + " lb)";
		return ret;
	},
	calcPsi: function() {
		var spec = st.character.spec;
		
		var emp = parseInt(spec.attributes["emp"], 10);
		var wil = parseInt(spec.attributes["wil"], 10);
		var isPsi = spec.demographics["psionic"] === "true";
		
		var ret = isPsi ? (emp + wil) : 0;
		return ret;
	},
	calcRng: function() {
		var spec = st.character.spec;
		
		var str = parseInt(spec.attributes["str"], 10);
		var rngm = 2 * str; // meters
		var rngft = Math.round(3.28084 * rngm); // ft
		var ret = rngm + " m (" + rngft + " ft)";
		return ret;
	},
	calcPointBlankRng: function() {
		var spec = st.character.spec;
		
		var dex = parseInt(spec.attributes["dex"], 10);
		var rngm = Math.round(dex / 3.0 * 10.0) / 10.0; // meters
		var rngft = Math.round(3.28084 * rngm * 10.0) / 10.0; // ft
		var ret = Math.round(rngm) + " m (" + Math.round(rngft) + " ft)";
		return ret;
	},
	charAverageStat: function() {
		var total = 0;
		for (var i=0;i<arguments.length;i++) {
			total += arguments[i];
		}
		var ret = Math.round(total / arguments.length);
		return ret;
	},
	charResponse: function(d, name) {
		st.log("char response");
		
		//st.log(d);
		//st.log(d.data);
		var fields = d.meta.fields;
		var data = d.data;
		
		var relStatCol = -1;
		for (var i=0; i<fields.length; i++) {
			var searchName = fields[i];
			if (searchName === "RelStat") {
				relStatCol = i;
				break;
			}			
		}
		
		st.log("relStatCol[" + relStatCol + "]");
		if (relStatCol) {
			var csvSpec = {};
			for (var i=0;i<data.length;i++) {
				var stat = {};
				stat.name = data[i]["Stat"];
				stat.value = data[i][searchName];
				stat.key = stat.name.toLowerCase();
				if (stat.value) {
					csvSpec[stat.key] = stat;
				}
			}
			st.character.relStat = csvSpec;
			st.log("csvSpec", csvSpec);
		}
		
		var nameCol = -1;
		for (var i=0; i<fields.length; i++) {
			var searchName = fields[i];
			if (searchName === name) {
				nameCol = i;
				break;
			}			
		}
		
		//st.log("nameCol[" + nameCol + "]");
		if (nameCol) {
			var csvSpec = {};
			for (var i=0;i<data.length;i++) {
				var stat = {};
				stat.name = data[i]["Stat"];
				stat.value = data[i][searchName];
				stat.key = stat.name.toLowerCase();
				csvSpec[stat.key] = stat;
			}
			//st.log(csvSpec);
			
			var spec = {};
			st.character.csvSpec = csvSpec;
			st.character.spec = spec;
			
			spec.allegiance = csvSpec["allegiance"].value;
			spec.overview = {};
			spec.overview["name"] = csvSpec["name"].value;
			spec.overview["ship"] = csvSpec["ship"].value;
			spec.overview["position"] = csvSpec["position"].value;
			spec.overview["searchName"] = searchName;
			spec.overview["quote"] = csvSpec["quote"].value;

			spec.demographics = {};
			spec.demographics["sex"] = csvSpec["sex"].value;
			spec.demographics["race"] = csvSpec["race"].value;
			spec.demographics["psionic"] = csvSpec["psionic"].value;
			
			spec.attributes = {};
			
			// physical
			spec.attributes["str"] = parseInt(csvSpec["str"].value, 10);
			spec.attributes["siz"] = parseInt(csvSpec["siz"].value, 10);
			spec.attributes["end"] = parseInt(csvSpec["end"].value, 10);
			spec.attributes["ini"] = parseInt(csvSpec["ini"].value, 10);
			spec.attributes["dex"] = parseInt(csvSpec["dex"].value, 10);
			
			// mental
			spec.attributes["per"] = parseInt(csvSpec["per"].value, 10);
			spec.attributes["wil"] = parseInt(csvSpec["wil"].value, 10);
			spec.attributes["cha"] = parseInt(csvSpec["cha"].value, 10);
			spec.attributes["rea"] = parseInt(csvSpec["rea"].value, 10);
			spec.attributes["emp"] = parseInt(csvSpec["emp"].value, 10);

			spec.demographics["grades"] = st.character.computeGrades();
			
			spec.attributes["hp"] = st.character.calcHp();
			
			st.character.splitSkills();

			st.character.loadEquipment();
		}
	},
	
	computeGrades: function() {
		var spec = st.character.spec;
		
		var physicalGrade = st.character.computePhysicalGrade();
		var mentalGrade = st.character.computeMentalGrade();
		
		var grades = physicalGrade + "-" + mentalGrade;
		return grades;
	},
	
	computePhysicalGrade: function() {
		var spec = st.character.spec;
		var attributes = spec.attributes;
		var average = (spec.attributes["str"]
			+ spec.attributes["siz"]
			+ spec.attributes["end"]
			+ spec.attributes["ini"]
			+ spec.attributes["dex"]) / 5.0
		var grade = st.character.computeGrade(average);
		return grade;
	},
	
	computeMentalGrade: function() {
		var spec = st.character.spec;
		var attributes = spec.attributes;
		var average = (spec.attributes["per"]
			+ spec.attributes["wil"]
			+ spec.attributes["cha"]
			+ spec.attributes["rea"]
			+ spec.attributes["emp"]) / 5.0;
		var grade = st.character.computeGrade(average);
		return grade;
	},
	
	computeGrade: function(average) {
		var grade = "";
		switch (true) {
			case average < (7+10)/2.0:
				grade = "Delta";
				break;
			case average < (10+12)/2.0:
				grade = "Gamma";
				break;
			case average < (12+15)/2.0:
				grade = "Beta";
				break;
			default:
				grade = "Alpha";
				break;
		}
		return grade;
	},
	
	splitSkills: function() {
		var csvSpec = st.character.csvSpec;
		var spec = st.character.spec;
		
		spec.skills = {};
		
		var skills0 = {};
		skills0["administration"] = csvSpec["administration"].value;
		skills0["astronomy"] = csvSpec["astronomy"].value;
		skills0["anthropology"] = csvSpec["anthropology"].value;
		skills0["bargain"] = csvSpec["bargain"].value;
		skills0["biology"] = csvSpec["biology"].value;
		skills0["chemistry"] = csvSpec["chemistry"].value;
		skills0["comms systems"] = csvSpec["comms systems"].value;
		skills0["computer science"] = csvSpec["computer science"].value;
		skills0["demolitions"] = csvSpec["demolitions"].value;
		skills0["detector ops"] = csvSpec["detector ops"].value;
		skills0["disguise"] = csvSpec["disguise"].value;
		skills0["economics"] = csvSpec["economics"].value;
		skills0["electronics"] = csvSpec["electronics"].value;
		skills0["esp"] = csvSpec["esp"].value;
		skills0["eva"] = csvSpec["eva"].value;
		skills0["farming"] = csvSpec["farming"].value;
		skills0["fast draw"] = csvSpec["fast draw"].value;
		skills0["fast talk"] = csvSpec["fast talk"].value;
		skills0["firearms"] = csvSpec["firearms"].value;
		skills0["first aid"] = csvSpec["first aid"].value;
		skills0["forcewall systems"] = csvSpec["forcewall systems"].value;
		skills0["forgery"] = csvSpec["forgery"].value;
		skills0["gambling"] = csvSpec["gambling"].value;
		skills0["geology"] = csvSpec["geology"].value;
		spec.skills["0"] = skills0;
		
		var skills1 = {};
		skills1["gunnery"] = csvSpec["gunnery"].value;
		skills1["healing"] = csvSpec["healing"].value;
		skills1["heavy weapons"] = csvSpec["heavy weapons"].value;
		skills1["hide"] = csvSpec["hide"].value;
		skills1["history"] = csvSpec["history"].value;
		skills1["interrogation"] = csvSpec["interrogation"].value;
		skills1["law"] = csvSpec["law"].value;
		skills1["leader"] = csvSpec["leader"].value;
		skills1["linguistics"] = csvSpec["linguistics"].value;
		skills1["mathematics"] = csvSpec["mathematics"].value;
		skills1["mechanical"] = csvSpec["mechanical"].value;
		skills1["medical"] = csvSpec["medical"].value;
		skills1["melee weapons"] = csvSpec["melee weapons"].value;
		skills1["mining"] = csvSpec["mining"].value;
		skills1["missile weapons"] = csvSpec["missile weapons"].value;
		skills1["navigation"] = csvSpec["navigation"].value;
		skills1["physics"] = csvSpec["physics"].value;
		skills1["pick pocket"] = csvSpec["pick pocket"].value;
		skills1["pilot"] = csvSpec["pilot"].value;
		skills1["political science"] = csvSpec["political science"].value;
		skills1["precognition"] = csvSpec["precognition"].value;
		skills1["probe"] = csvSpec["probe"].value;
		skills1["psychology"] = csvSpec["psychology"].value;
		spec.skills["1"] = skills1;
		
		var skills2 = {};			
		skills2["psychometry"] = csvSpec["psychometry"].value;
		skills2["research"] = csvSpec["research"].value;
		skills2["recon"] = csvSpec["recon"].value;
		skills2["security systems"] = csvSpec["security systems"].value;
		skills2["ship tactics"] = csvSpec["ship tactics"].value;
		skills2["stardrive ops"] = csvSpec["stardrive ops"].value;
		skills2["stealth"] = csvSpec["stealth"].value;
		skills2["streetwise"] = csvSpec["streetwise"].value;
		skills2["surgery"] = csvSpec["surgery"].value;
		skills2["survival"] = csvSpec["survival"].value;
		skills2["swim"] = csvSpec["swim"].value;
		skills2["tactics"] = csvSpec["tactics"].value;
		skills2["telecontrol"] = csvSpec["telecontrol"].value;
		skills2["telekinesis"] = csvSpec["telekinesis"].value;
		skills2["telepathy"] = csvSpec["telepathy"].value;
		skills2["teleport systems"] = csvSpec["teleport systems"].value;
		skills2["teleportation"] = csvSpec["teleportation"].value;
		skills2["thrown weapons"] = csvSpec["thrown weapons"].value;
		skills2["unarmed combat"] = csvSpec["unarmed combat"].value;
		skills2["vehicle (air)"] = csvSpec["vehicle (air)"].value;
		skills2["vehicle (ground)"] = csvSpec["vehicle (ground)"].value;
		skills2["vehicle (water)"] = csvSpec["vehicle (water)"].value;
		skills2["weapons systems"] = csvSpec["weapons systems"].value;
		spec.skills["2"] = skills2;
	},
	
	setSkill: function(skill, value) {
		try {
			st.log("setting skill[" + skill + "], value[" + value + "]");
			var csvSpec = st.character.csvSpec;
			csvSpec[skill].value = value;
			st.log("updated skill[" + skill + "], csvSpec[skill].value[" + csvSpec[skill].value + "]");
		} catch (e) {
			st.log("Cannot set skill[" + skill + "], value[" + value + "]")
		}
	},
	
	updateSkill: function(skill, value) {
		try {
			st.log("updating skill[" + skill + "], value[" + value + "]");
			var csvSpec = st.character.csvSpec;
			var skillValue = csvSpec[skill].value;
			csvSpec[skill].value = parseInt(skillValue, 10) + value;
			st.log("updated skill[" + skill + "], csvSpec[skill].value[" + csvSpec[skill].value + "]");
		} catch (e) {
			st.log("Cannot update skill[" + skill + "], skillValue[" + skillValue + "], value[" + value + "]")
		}
	},
	
	loadEquipment: function() {
		var spec = st.character.spec;
		var searchName = spec.overview["searchName"].toLowerCase();
		$.ajax("js/equipment/st-" + searchName + ".json")
			.done(function(data, status, jqxhr) {
				spec.equipment = data.equipment;
			})
			.fail(function(e) {
				st.log("Error: unable to load equipment for searchName[" + searchName + "]", e);
			})
			.always(function() {
				setTimeout(st.render.render, 10);
			});
	}
};