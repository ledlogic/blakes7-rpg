/* st-dynamic.js */

st.dynamic = {
	char: null,
	init: function() {
		st.log("init dynamic");
	},
	calcGrade: function() {
		var d = st.math.dieN(100);
		switch (true) {
			case (d<46):
				return { "grade": "Delta", "symbol": "𝛿", "attr": 7 };
				break;
			case (d<66):
				return { "grade": "Gamma", "symbol": "𝛾", "attr": 10 };
				break;
			case (d<86):
				return { "grade": "Beta", "symbol": "𝛽", "attr": 12 };
				break;
			default:
				return { "grade": "Alpha", "symbol": "𝛼", "attr": 15 };
				break;
		}
	},
	charResponse: function(d, name) {
		st.log("dynamic char response");
		
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
		
		st.log("nameCol[" + nameCol + "]");
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
			spec.overview["name"] = "______________________";
			spec.overview["ship"] = "______________________";
			spec.overview["position"] = "______________________";
			spec.overview["searchName"] = searchName;
			spec.overview["quote"] = "";

			spec.demographics = {};
			spec.demographics["sex"] = csvSpec["sex"].value;
			spec.demographics["race"] = csvSpec["race"].value;
			spec.demographics["psionic"] = csvSpec["psionic"].value;
			
			spec.attributes = {};
			
			// physical
			spec.grade = {};
			var physicalGrade = st.dynamic.calcGrade();
			spec.grade.physical = physicalGrade;
			spec.attributes["str"] = physicalGrade["attr"];
			spec.attributes["siz"] = physicalGrade["attr"];
			spec.attributes["end"] = physicalGrade["attr"];
			spec.attributes["ini"] = physicalGrade["attr"];
			spec.attributes["dex"] = physicalGrade["attr"];
			
			// mental
			var mentalGrade = st.dynamic.calcGrade();
			spec.grade.mental = mentalGrade;
			spec.attributes["per"] = mentalGrade["attr"];
			spec.attributes["wil"] = mentalGrade["attr"];
			spec.attributes["cha"] = mentalGrade["attr"];
			spec.attributes["rea"] = mentalGrade["attr"];
			spec.attributes["emp"] = mentalGrade["attr"];
			
			spec.attributes["hp"] = st.character.calcHp();
			
			spec.demographics["grades"] = st.character.computeGrades();
			
			st.dynamic.loadSpec();
		}		
	},
	
	loadSpec: function() {
		var char = st.dynamic.char;
		var csvSpec = st.character.csvSpec;
		var spec = st.character.spec;
		st.log("loadSpec, char[" + char + "]");
		switch (char) {
			case 'fciw':
				var skills = st.dynamic.findNSkillsOfAttr("REA", 4);
				_.each(skills, function(skill, index) {
					st.log("132 csvSpec[skill].value",csvSpec[skill].value);
					csvSpec[skill].value = parseInt(csvSpec[skill].value,10) + (index === 0 ? 35 : 15);
					st.log("134 spec.grade.mental.grade",spec.grade.mental.grade);
					st.log("135 csvSpec[skill].value",csvSpec[skill].value);
					switch (spec.grade.mental.grade) {
						case "Delta":
							break;
						case "Gamma":
							csvSpec[skill].value += 5;
							break;
						case "Beta":
							csvSpec[skill].value += 10;
							break;
						case "Alpha":
							csvSpec[skill].value += 20;
							break;
					}
					st.log("149 csvSpec[skill].value",csvSpec[skill].value);
				});
				break;
		}
		st.character.splitSkills();
		setTimeout(st.render.render, 10);
	},
	findSkillsOfAttr: function(attr, qty) {
		var ret = [];
		for (var i in st.character.relStat) {
			var relStat = st.character.relStat[i].value;
			st.log("i[" + i + "]");
			st.log("relStat[" + relStat + "]");
			if (relStat.indexOf(attr) > -1) {
				ret.push(i);
			}
		}
		return ret;
	},
	findNSkillsOfAttr: function(attr, qty) {
		var ret = [];
		var skills = st.dynamic.findSkillsOfAttr(attr);
		st.log("skills[" + skills + "]");
		while (ret.length < qty) {
			var skill = skills[st.math.dieArray(skills)];
			st.log("skill[" + skill + "]");
			if (ret.indexOf(skill) === -1) {
				ret.push(skill);	
			}			
		}
		return ret;
	}
};
