/* st-char.js */

st.character = {
	spec: {},
	$pageft: null,
	init: function() {
		st.log("init character");
		st.character.$pageft = $(".st-page .st-page-ft");
	},
	loadChar: function(uri) {
		st.log("loading char");
		
		if (uri.indexOf(".json") > -1) {
			st.character.loadCharJson(uri);
		}
		if (uri.indexOf(".csv") > -1) {
			st.character.loadCharCsv(uri);
		}
	},
	loadCharJson: function(uri) {
		st.log("loading char from json");
		
		$.ajax("js/char/" + uri)
		.done(function(data, status, jqxhr) {
			st.character.spec = data.spec;
			setTimeout(st.character.render, 10);
		})
		.fail(function() {
			alert("Error: unable to load character.");
		})
		.always(function() {
		});
	},
	loadCharCsv: function(uri) {
		st.log("loading char from csv");
		
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
	charMapStrStatBetweenBases: function(strStat, baseIn, baseOut) {
		if (!baseIn) baseIn = 1;
		if (!baseOut) baseOut = 1;
		var ret = Math.round(parseInt(strStat, 10) * baseOut / baseIn);
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
			
			var baseMap = st.character.charMapStrStatBetweenBases;
			spec.attributes = {};
			
			// physical
			spec.attributes["str"] = csvSpec["str"].value;
			spec.attributes["siz"] = csvSpec["siz"].value;
			spec.attributes["end"] = csvSpec["end"].value;
			spec.attributes["ini"] = csvSpec["ini"].value;
			spec.attributes["dex"] = csvSpec["dex"].value;
			
			// mental
			spec.attributes["per"] = csvSpec["per"].value;
			spec.attributes["wil"] = csvSpec["wil"].value;
			spec.attributes["cha"] = csvSpec["cha"].value;
			spec.attributes["rea"] = csvSpec["rea"].value;
			spec.attributes["emp"] = csvSpec["emp"].value;
			
			spec.attributes["hp"] = st.character.calcHp();
			
			spec.skills = {};
			
			var skills0 = {};
			skills0["administration"] = baseMap(csvSpec["administration"].value);
			skills0["astronomy"] = baseMap(csvSpec["astronomy"].value);
			skills0["anthropology"] = baseMap(csvSpec["anthropology"].value);
			skills0["bargain"] = baseMap(csvSpec["bargain"].value);
			skills0["chemistry"] = baseMap(csvSpec["chemistry"].value);
			skills0["comms systems"] = baseMap(csvSpec["comms systems"].value);
			skills0["computer science"] = baseMap(csvSpec["computer science"].value);
			skills0["demolitions"] = baseMap(csvSpec["demolitions"].value);
			skills0["detector ops"] = baseMap(csvSpec["detector ops"].value);
			skills0["disguise"] = baseMap(csvSpec["disguise"].value);
			skills0["economics"] = baseMap(csvSpec["economics"].value);
			skills0["electronics"] = baseMap(csvSpec["electronics"].value);
			skills0["eva"] = baseMap(csvSpec["eva"].value);
			skills0["farming"] = baseMap(csvSpec["farming"].value);
			skills0["fast draw"] = baseMap(csvSpec["fast draw"].value);
			skills0["fast talk"] = baseMap(csvSpec["fast talk"].value);
			skills0["firearms"] = baseMap(csvSpec["firearms"].value);
			skills0["first aid"] = baseMap(csvSpec["first aid"].value);
			skills0["forcewall systems"] = baseMap(csvSpec["forcewall systems"].value);
			skills0["forgery"] = baseMap(csvSpec["forgery"].value);
			skills0["gambling"] = baseMap(csvSpec["gambling"].value);
			spec.skills["0"] = skills0;
			
			var skills1 = {};
			skills1["geology"] = baseMap(csvSpec["geology"].value);
			skills1["gunnery"] = baseMap(csvSpec["gunnery"].value);
			skills1["heavy weapons"] = baseMap(csvSpec["heavy weapons"].value);
			skills1["hide"] = baseMap(csvSpec["hide"].value);
			skills1["history"] = baseMap(csvSpec["history"].value);
			skills1["interrogation"] = baseMap(csvSpec["interrogation"].value);
			skills1["law"] = baseMap(csvSpec["law"].value);
			skills1["leader"] = baseMap(csvSpec["leader"].value);
			skills1["linguistics"] = baseMap(csvSpec["linguistics"].value);
			skills1["mathematics"] = baseMap(csvSpec["mathematics"].value);
			skills1["mechanical"] = baseMap(csvSpec["mechanical"].value);
			skills1["medical"] = baseMap(csvSpec["medical"].value);
			skills1["melee weapons"] = baseMap(csvSpec["melee weapons"].value);
			skills1["mining"] = baseMap(csvSpec["mining"].value);
			skills1["missle weapons"] = baseMap(csvSpec["missle weapons"].value);
			skills1["navigation"] = baseMap(csvSpec["navigation"].value);
			skills1["physics"] = baseMap(csvSpec["physics"].value);
			skills1["pick pocket"] = baseMap(csvSpec["pick pocket"].value);
			skills1["pilot"] = baseMap(csvSpec["pilot"].value);
			skills1["political science"] = baseMap(csvSpec["political science"].value);
			spec.skills["1"] = skills1;
			
			var skills2 = {};			
			skills2["psychology"] = baseMap(csvSpec["psychology"].value);
			skills2["research"] = baseMap(csvSpec["research"].value);
			skills2["recon"] = baseMap(csvSpec["recon"].value);
			skills2["security systems"] = baseMap(csvSpec["security systems"].value);
			skills2["ships' tactics"] = baseMap(csvSpec["ships' tactics"].value);
			skills2["stardrive ops"] = baseMap(csvSpec["stardrive ops"].value);
			skills2["stealth"] = baseMap(csvSpec["stealth"].value);
			skills2["streetwise"] = baseMap(csvSpec["streetwise"].value);
			skills2["surgery"] = baseMap(csvSpec["surgery"].value);
			skills2["survival"] = baseMap(csvSpec["survival"].value);
			skills2["swim"] = baseMap(csvSpec["swim"].value);
			skills2["tactics"] = baseMap(csvSpec["tactics"].value);
			skills2["teleport systems"] = baseMap(csvSpec["teleport systems"].value);
			skills2["thrown weapons"] = baseMap(csvSpec["thrown weapons"].value);
			skills2["unarmed combat"] = baseMap(csvSpec["unarmed combat"].value);
			skills2["vehicle (air)"] = baseMap(csvSpec["vehicle (air)"].value);
			skills2["vehicle (ground)"] = baseMap(csvSpec["vehicle (ground)"].value);
			skills2["vehicle (water)"] = baseMap(csvSpec["vehicle (water)"].value);
			skills2["weapons systems"] = baseMap(csvSpec["weapons systems"].value);
			skills2["telepathy"] = baseMap(csvSpec["telepathy"].value);
			spec.skills["2"] = skills2;
			
			setTimeout(st.character.render, 10);
		}
	},
	render: function() {
		st.log("rendering char");

		var that = st.character;
		
		that.renderReset();		
		that.renderAllegiance();
		that.renderOverview();
		that.renderDemographics();
		that.renderStress();
		that.renderAttributes();
		that.renderCombat();
		that.renderSkills();
		that.renderGrid();
		
		$(".st-page").removeClass("st-initial-state");
	},
	renderReset: function() {
		st.character.$pageft.html("");
	},
	renderAllegiance: function() {
		st.log("rendering allegiance");

		var left = 0;
		var top = 0;
		var size = 200;
		var spec = st.character.spec;
		var all = spec.allegiance.toLowerCase().replace(/\s\'/g, "-").replace(/\'/g, "");
		var img = "img/blake's-7/" + st.character.spec.overview.searchName.toLowerCase() + ".jpg";			
				
		// attr
		var $attr = $("<div class=\"st-section st-allegiance\" style=\"left: " + left + "px; top: " + top + "px;\">"
				      + "<img src=\"" + img + "\" height=\"" + size + "\" />"
				      + "</div>");
		st.character.$pageft.append($attr);
	},
	renderAttributes: function() {
		st.log("rendering attributes");

		var spec = st.character.spec;
		var attr = spec.attributes;

		// attr
		var $attr = $("<div class=\"st-section st-attributes\"></div>");
		_.each(attr, function(value, key) {
			var desc = st.stat.descriptions[key];
			var h = "<span class=\"st-attribute-label\">" + key + "</span> "
			      + "<span class=\"st-attribute-value\">" + value + "</span>"
			      + "<span class=\"st-attribute-description\">" + desc + "</span>";
			var $elm = $("<span class=\"st-item st-attribute st-attribute-" + key + "\">" + h + "</span>");
			$attr.append($elm);
		});
		st.character.$pageft.append($attr);
		
	    $(".st-attribute-label").lettering();
	},
	renderCombat: function() {
		st.log("rendering combat");
		
		st.character.spec.combat = {
			"hth": st.character.calcHth(),
			"rng": st.character.calcRng(),
			"cap": st.character.calcLoad(),
			"psi": st.character.calcPsi()
		};

		var spec = st.character.spec;
		var attr = spec.combat;

		// attr
		var $attr = $("<div class=\"st-section st-combat\"></div>");
		_.each(attr, function(value, key) {
			var h = "<span class=\"st-attribute-label\">" + key + "</span> "
			      + "<span class=\"st-attribute-value\">" + value + "</span>";
			var $elm = $("<span class=\"st-item st-attribute st-attribute-" + key + "\">" + h + "</span>");
			$attr.append($elm);
		});
		st.character.$pageft.append($attr);
		
	    $(".st-attribute-label").lettering();
	},
	renderDemographics: function() {
		st.log("rendering demographics");

		var spec = st.character.spec;
		var demographics = spec.demographics;
		
		// page
		var $demographics = $("<div class=\"st-section st-demographics\"></div>");
		_.each(demographics, function(value, key) {
			var h = "<span class=\"st-demographic-label\">" + key + "</span> "
		          + "<span class=\"st-demographic-value\">" + value + "</span>";
			
			var $elm = $("<span class=\"st-item st-demographics-item st-demographics-item-" + key + "\">" + h + "</span>");
			$demographics.append($elm);
		});
		st.character.$pageft.append($demographics);
	},
	renderGrid: function() {
		st.log("rendering grid");
		
		// page
		var $grid = $("<div class=\"st-section st-grid\">"
				  + "</div>");
		st.character.$pageft.append($grid);
	},
	renderOverview: function() {
		st.log("rendering overview");

		var spec = st.character.spec;
		var overview = spec.overview;

		// page
		var $overview = $("<div class=\"st-section st-overview\"></div>");
		_.each(overview, function(value, key) {
			var h = "<span class=\"st-overview-label\">" + key + "</span> "
			      + "<span class=\"st-overview-value\">" + value + "</span>";
			if (h.indexOf(",") > -1) {
				h = h.split(",");
				h = h.join("<br/>");
			}
			if (!h) {
				h = "&nbsp;";
			}
			var $elm = $("<span class=\"st-item st-overview-item st-overview-item-" + key + "\">" + h + "</span>");
			$overview.append($elm);
		});
		st.character.$pageft.append($overview);
	},
	renderSkills: function() {
		st.log("rendering skills");

		var spec = st.character.spec;

		var skills = spec.skills;
		
		// there are three sets of skills, to match the display
		for (var i=0;i<3;i++) {
			var skillsI = skills[i];

			var y = 0;
			
			var $skillsI = $("<div class=\"st-section st-skills st-skills-" + i + "\"></div>");
			_.each(skillsI, function(value, key) {
				var h = value + "";
				if (!h) {
					h = "&nbsp;"
				}
				var elm = "";
				var classKey = key;
				var dispKey = _.capitalize2(key.replace(/-/g, ' '));
				if (dispKey) {
					elm += ("<span class=\"st-item st-skill-item-key st-skill-item-key-" + classKey + "\""
							+" style=\"top: " + y + "px\""
							+">" + dispKey + "</span>");
				}
				elm += ("<span class=\"st-item st-skill-item st-skill-item-" + key + "\""
						+" style=\"top: " + y + "px\""
						+">" + h + "</span>");
				$skillsI.append(elm);
				y += 20;
			});
			st.character.$pageft.append($skillsI);
		}		
	},
	renderStress: function() {
		st.log("rendering stress");

		var spec = st.character.spec;
		var attr = spec.attributes;
		var wil = parseInt(spec.attributes["wil"], 10);

		// page
		var $stress = $("<div class=\"st-section st-stress\"></div>");
		var h = "<span class=\"st-item st-stress-header-stress\">Stress</span>"
		      + "<span class=\"st-item st-stress-header-penalty\">Penalty</span>";
		var $elm = $("<span class=\"st-item st-stress-header\">" + h + "</span>");
		$stress.append($elm);
		for (var i=0; i>=-4; i--) {
			h = "";
			for (var j=0; j<wil; j++) {
				h+= "<span class=\"st-stress-item-checkbox st-stress-item-checkbox-" + j + "\">&nbsp;</span>";
			}
			for (var j=wil; j<20; j++) {
				h+= "<span class=\"st-stress-item-checkbox " + (j === wil ? "first" : "") + " is-not-visible\">&nbsp;</span>";
			}
			h+= "<span class=\"st-stress-item-desc\">" + i*10 + "% / " + i + "</span>";

			$elm = $("<span class=\"st-item st-stress-item\">" + h + "</span>");
			$stress.append($elm);
		}
		st.character.$pageft.append($stress);
	}
};