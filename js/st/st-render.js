/* st-render.js */

st.render = {
	$pageft: null,
	init: function() {
		st.log("init render");
		st.render.$pageft = $(".st-page .st-page-ft");
	},
	render: function() {
		st.log("rendering char");

		var that = st.render;
		
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
		st.render.$pageft.html("");
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
		st.render.$pageft.append($attr);
	},
	renderAttrClass: function(key, val) {
		if (key == "hp") {
			return "";
		}
		switch (true) {
			case val < 5:
				return "st-low-attr";
				break;
			case val < 15:
				return "st-mid-attr";
				break;
			default:
				return "st-high-attr";
				break;
		}
	},
	renderAttributes: function() {
		st.log("rendering attributes");

		var spec = st.character.spec;
		var attr = spec.attributes;

		// attr
		var $attr = $("<div class=\"st-section st-attributes\"></div>");
		_.each(attr, function(value, key) {
			if (key == "hp") {
				return;
			}
			
			var desc = st.stat.descriptions[key];
			
			var valueRangeClass = st.render.renderAttrClass(key, value);
			
			var h = "<span class=\"st-attribute-label\">" + key + "</span> "
			      + "<span class=\"st-attribute-value " + valueRangeClass + "\">" + value + "</span>"
			      + "<span class=\"st-attribute-description\">" + desc + "</span>";
			var $elm = $("<span class=\"st-item st-attribute st-attribute-" + key + "\">" + h + "</span>");
			$attr.append($elm);
		});
		st.render.$pageft.append($attr);
		
	    $(".st-attribute-label").lettering();
	},
	renderCombat: function() {
		st.log("rendering combat");
		
		st.character.spec.combat = {
			"hth": st.character.calcHth(),
			"pbr": st.character.calcPointBlankRng(),
			"rng": st.character.calcRng(),
			"cap": st.character.calcLoad(),
			"psi": st.character.calcPsi(),
			"hp": st.character.spec.attributes["hp"]
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
		st.render.$pageft.append($attr);
		
		
		var $hpbox = $("<div class=\"st-section st-hp-box\"></div>");
		st.render.$pageft.append($hpbox);
		
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
		st.render.$pageft.append($demographics);
	},
	renderGrid: function() {
		st.log("rendering grid");
		
		var spec = st.character.spec;
		var equipment = spec.equipment;
		
		// equipment
		var h = [];
		if (equipment) {
			h.push("<h5>Equipment</h5>");
			h.push("<ul>");
			for (var i=0; i<equipment.length; i++) {
				var ds = [];
				_.each(equipment[i], function(value, key) {
					if (key == "name") {
						ds.push("<dt>" + value + "</dt>");
					} else {
						ds.push("<dt>" + key + ":</dt>");
						ds.push("<dd>" + value + "</dd>");
					}
				});
				h.push("<li class=\"st-equipment-item\">"
					+ ds.join("\n")
					+ "</li>");		
			}
			h.push("</ul>");
		}
		
		// page
		var $grid = $("<div class=\"st-section st-grid\">"
				  + h.join("\n")
				  + "</div>");		
		
		st.render.$pageft.append($grid);
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
		st.render.$pageft.append($overview);
	},
	renderSkills: function() {
		st.log("rendering skills");

		var spec = st.character.spec;

		var skills = spec.skills;
		
		// there are three sets of skills, to match the display
		for (var i=0;i<3;i++) {
			var skillsI = skills[i];
			var y = 20;
			var title = (i===0) ? "Skills" : "";
			var $skillsI = $("<div class=\"st-section st-skills st-skills-" + i + "\"><span class=\"st-skills-title st-item\">" + title + "</span></div>");
			_.each(skillsI, function(value, key) {
				var h = value + "";
				if (!h) {
					h = "&nbsp;"
				}
				var elm = "";
				var classKey = key;
				var dispKey = _.capitalize2(key.replace(/-/g, ' '));
				
				var stat = st.character.relStat[key].value;
				//st.log(st.character.relStat);

				var hclass = st.render.calcSkillClass(h);
				
				if (dispKey) {
					elm += ("<span class=\"st-item st-skill-item-key st-skill-item-key-" + classKey + " " + hclass + "\""
							+" style=\"top: " + y + "px\""
							+">" + dispKey + "</span>");
				}
				elm += ("<span class=\"st-item st-skill-item-stat st-skill-item-" + key + " " + hclass + "\""
						+" style=\"top: " + y + "px\""
						+">" + stat + "</span>");

				elm += ("<span class=\"st-item st-skill-item st-skill-item-" + key + " " + hclass + "\""
						+" style=\"top: " + y + "px\""
						+">" + h + "</span>");
				
				$skillsI.append(elm);
				y += 20;
			});
			st.render.$pageft.append($skillsI);
		}		
	},
	calcSkillClass: function(h) {
		var ret = "";
		switch (true) {
			case (h>=80):
				ret = "st-skill-extreme";
				break;
			case (h>=60):
				ret = "st-skill-high";
				break;
			case (h>=40):
				ret = "st-skill-medium";
				break;
			default:
				ret = "st-skill-low";
				break;
		}
		return ret;
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
		st.render.$pageft.append($stress);
	}
};