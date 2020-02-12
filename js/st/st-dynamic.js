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
	
	calcMaximumSkillBonus: function() {
		var r1 = st.dynamic.calcPhysicalSkillBonus();
		var r2 = st.dynamic.calcMentalSkillBonus();
		return Math.max(r1, r2);
	},
	
	calcPhysicalSkillBonus: function() {
		var spec = st.character.spec;
		var value = 0;
		switch (spec.grade.physical.grade) {
			case "Delta":
				break;
			case "Gamma":
				value += 5;
				break;
			case "Beta":
				value += 10;
				break;
			case "Alpha":
				value += 20;
				break;
		}
		return value;
	},
	
	calcMentalSkillBonus: function() {
		var spec = st.character.spec;
		var value = 0;
		switch (spec.grade.mental.grade) {
			case "Delta":
				break;
			case "Gamma":
				value += 5;
				break;
			case "Beta":
				value += 10;
				break;
			case "Alpha":
				value += 20;
				break;
		}
		return value;
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
					var value = (index === 0 ? 35 : 15);
					value += st.dynamic.calcMentalSkillBonus();
					st.character.updateSkill(skill, value);
				});
				break;
			case 'fcow':
				var value = 20;
				value += st.dynamic.calcMaximumSkillBonus();
				st.character.updateSkill("survival", value);
				var skills = [
					"administration",
					"electronics",
					"farming",
					"first aid",
					"mechanical",
					"medical",
					"mining"				
				];
				var skills = st.dynamic.findNSkills(skills, 2);
				_.each(skills, function(skill, index) {
					var value = (index === 0 ? 30 : 15);
					// TODO: find grade for skill
					value += st.dynamic.calcMaximumSkillBonus();
					st.character.updateSkill(skill, value);
				});
				break;
		}
		st.character.splitSkills();
		setTimeout(st.render.render, 10);
	},
	findNSkills: function(skills, qty) {
		var ret = [];
		while (ret.length < qty) {
			var skill = skills[st.math.dieArray(skills)];
			if (ret.indexOf(skill) === -1) {
				ret.push(skill);	
			}			
		}
		return ret;
	},
	findSkillsOfAttr: function(attr, qty) {
		var ret = [];
		for (var i in st.character.relStat) {
			var relStat = st.character.relStat[i].value;
			if (relStat.indexOf(attr) > -1) {
				ret.push(i);
			}
		}
		return ret;
	},
	findNSkillsOfAttr: function(attr, qty) {
		var skills = st.dynamic.findSkillsOfAttr(attr);
		var ret = st.dynamic.findNSkills(skills, qty);
		return ret;
	}
};
