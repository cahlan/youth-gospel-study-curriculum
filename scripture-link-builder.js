var _ = require('underscore');
var fs = require('fs');

var dir = './weeks/';

var scripture_match = {
	ot: {
		Genesis: 'gen',
		Exodus: 'ex',
		Leviticus: 'lev',
		Numbers: 'num',
		Deuteronomy: 'deut',
		Joshua: 'josh',
		Judges: 'judg',
		Ruth: 'ruth',
		'1 Samuel': '1-sam',
		'2 Samuel': '2-sam',
		'1 Kings': '1-kgs',
		'2 Kings': '2-kgs',
		'1 Chronicles': '1-chr',
		'2 Chronicles': '2-chr',
		Ezra: 'ezra',
		Nehemiah: 'neh',
		Esther: 'esth',
		Job: 'job',
		Psalms: 'ps',
		Proverbs: 'prov',
		Ecclesiastes: 'eccl',
		'Song of Solomon': 'song',
		Isaiah: 'isa',
		Jeremiah: 'jer',
		Lamentations: 'lam',
		Ezekiel: 'ezek',
		Daniel: 'dan',
		Hosea: 'hosea',
		Joel: 'joel',
		Amos: 'amos',
		Obadiah: 'obad',
		Jonah: 'jonah',
		Micah: 'micah',
		Nahum: 'nahum',
		Habakkuk: 'hab',
		Zephaniah: 'zeph',
		Haggai: 'hag',
		Zechariah: 'zech',
		Malachi: 'mal'
	},
	nt: {
		Matthew: 'matt',
		Mark: 'mark',
		Luke: 'luke',
		John: 'john',
		Acts: 'acts',
		Romans: 'rom',
		'1 Corinthians': '1-cor',
		'2 Corinthians': '2-cor',
		Galatians: 'gal',
		Ephesians: 'eph',
		Philippians: 'philip',
		Colossians: 'col',
		'1 Thessalonians': '1-thes',
		'2 Thessalonians': '2-thes',
		'1 Timothy': '1-tim',
		'2 Timothy': '2-tim',
		Titus: 'titus',
		Philemon: 'philem',
		Hebrews: 'heb',
		James: 'james',
		'1 Peter': '1-pet',
		'2 Peter': '2-pet',
		'1 John': '1-jn',
		'2 John': '2-jn',
		'3 John': '3-jn',
		Jude: 'jude',
		Revelation: 'rev'
	},
	bofm: {
		'1 Nephi': '1-ne',
		'2 Nephi': '2-ne',
		Jacob: 'jacob',
		Enos: 'enos',
		Jarom: 'jarom',
		Omni: 'omni',
		'Words of Mormon': 'w-of-m',
		Mosiah: 'mosiah',
		Alma: 'alma',
		Helaman: 'helaman',
		'3 Nephi': '3-ne',
		'4 Nephi': '4-ne',
		Ether: 'ether',
		Mormon: 'morm',
		Moroni: 'moro'
	},
	'dc-testament': {

	},
	pgp: {
		Moses: 'moses',
		Abraham: 'abr'
	}
}
var re_scripture_match = /([0-9]+\s+?)?([\w|&]+)[^\S\n]+(\d+):((\d+)((–|,\s+)(\d+))?)/g;

var files;

if (process.argv.length >= 3) {
	var file = process.argv[2].split("=")[1];
	files = [file];
}

if (!files) {
	var files = fs.readdirSync(dir);
}


files.forEach(function(file) {
	var str = fs.readFileSync(dir+'/'+file, 'utf8');
	var copy = new String(str);
	//console.log(file,"\n");
	var match = re_scripture_match.exec(str);
	while(match != null) {
		if (match) {
			var s = "[";
			var book = match[1] ? match[1]+match[2] : match[2];
			var scrip_url;
			var book_url;
			var chapter = match[3];
			var verses = match[4];
			var scrip_dict;
			for(var scrip_key in scripture_match) {//_.each(_.keys(scripture_match), function(book_short, key) {
				if (_.contains(_.keys(scripture_match[scrip_key]), book)) {
					scrip_dict = scripture_match[scrip_key];
					scrip_url = scrip_key;
					book_url = scrip_dict[book];
				}
				// if (_.contains(_.keys(scripture_match[book_short]), book)) {
				// 	console.log("matched", scripture_match[key]);
				// 	book_dict = scripture_match[book_short];
				// 	//scrip_url
				// 	book_url = book_dict[book];
				// }
			}//);
			if (book === 'D&C') {
				scrip_url = 'dc-testament';
				book_url = 'dc';
			}
			if (book === 'Faith') {
				book = 'Articles of Faith';
				scrip_url = 'pgp';
				book_url = 'a-of-f';
			}
			s += book+" "+chapter+":"+match[4]+"](";
			var url = "https://www.lds.org/scriptures/"+scrip_url+"/"+book_url+"/"+chapter;
			if (verses) {
				url += "."+verses;
			}
			//get rid of n dash
			url = url.replace(/\u2013|\u2014/g, '-');
			s += url+')';
			//final markdown link
			//console.log(s);
			//final file string
			//console.log("replacing",match[0],"with",s);
			copy = copy.replace(match[0], s);
		}
		match = re_scripture_match.exec(str);
	}
	console.log('finished with ', file, '-------------------\n\n');
	fs.writeFileSync(dir+'/'+file, copy);
});

// var str = "## June 19: Obedience"+
// "\n"+
// "### Reflection Questions\n"+
// "\n"+
// "### Study\n"+
// "2 Nephi 2:26–29; Alma 12:31; D&C 58:26–29; D&C 82:8–10; D&C 130:20–21; John 14:15, 21; Ecclesiastes 12:13"+
// "\n"+
// "### Activities / Challenges\n"+
// "\n"+
// "## June 20: Pray Often\n"+
// "\n"+
// "### Reflection Questions\n"+
// "\n"+
// "### Study\n"+
// "2 Nephi 32:8–9; Enos 1:1–12; Alma 34:17–28; Moroni 10:3–5; D&C 6:22–23; D&C 8:2–3; D&C 9:7–9; D&C 19:28; 1 Kings 19:11–12; Bible Dictionary, “Prayer”";


