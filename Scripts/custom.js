var database_link = "https://hsaygan.github.io/Chords-Station/database.json";

function postUpdatedChord(timer, time_interval, chord)
{
    setTimeout(function() {
        console.log("\t\tCurrent Time: ", timer.getTimeValues().minutes, ":", timer.getTimeValues().seconds, ":", timer.getTimeValues().secondTenths);
        document.getElementById("display_chord").innerHTML = chord;
    }, time_interval);
}

function getSongChords(database, file_object)
{
    console.log("\n=========== LEVEL 2");

    //Initializations
    //document.getElementById('calendar').src = database[artist_name][i].youtube_link;
    var timer = new Timer();
    timer.start();

    //Display Timer
    timer.addEventListener('secondsUpdated', function (e) {
        document.getElementById("timer").innerHTML = timer.getTimeValues().toString();
    });

    //Display Chords
    var all_lines = file_object.toString().split("\n");
    console.log("\nAll Lines: ",  all_lines);
    for (var j = 0; j < all_lines.length-1; j++)
    {
        var current_line = all_lines[j].split(":");
        console.log("\nCurrent Line: " + current_line);
        var minutes = parseInt(current_line[0]);
        var seconds = parseInt(current_line[1]);
        var secondTenths = parseInt(current_line[2]);
        var chord = current_line[3];
        var time_interval = Math.abs(60*1000*(timer.getTimeValues().minutes-minutes)) + Math.abs(1000*(timer.getTimeValues().seconds-seconds)) + Math.abs(100*(timer.getTimeValues().secondTenths-secondTenths)) ;
        console.log("\n\tTime Interval: ", time_interval);
        console.log("\n\tChange Time: ", minutes, ":", seconds, ":", secondTenths, " to Chord: ", chord);

        postUpdatedChord(timer, time_interval, chord);
    }
}

function findSongChords(song_name, artist_name)
{
    var xhr1 = new XMLHttpRequest();
    xhr1.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var database = JSON.parse(xhr1.responseText);
            console.log("\n=========== LEVEL 1\n Database = ", database);

            var song_found = false;
            for (var i = 0; i < database[artist_name].length; i++)
            {
                console.log("\nSong: " + database[artist_name][i].song + " by " + artist_name);
                if (database[artist_name][i].song == song_name)
                {
                    song_found = true;
                    console.log("\n\tChosen Song: " + database[artist_name][i].song +
                                "\n\tLink: " + database[artist_name][i].chords_link +
                                "\n\tYoutube Link: " + database[artist_name][i].youtube_link);

                    var xhr2 = new XMLHttpRequest();
                    xhr2.onreadystatechange = function()
                    {
                        if (this.readyState == 4 && this.status == 200)
                        {
                            var file_object = xhr2.responseText;
                            getSongChords(database, file_object);
                        }
                    };
                    xhr2.open("GET", database[artist_name][i].chords_link, true);
                    xhr2.send();
                }
            }
            if (song_found == false)
            {
                document.getElementById("display_chord").innerHTML = "Song not Found!";
            }
        }
    };
    xhr1.open("GET", database_link, true);
    xhr1.send();
}

findSongChords("Dil Mere", "Local Train")
