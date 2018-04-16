var database_link = "https://hsaygan.github.io/Chords-Station/database.json";

function run_this_random(song_name, artist_name)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var database = JSON.parse(xhttp.responseText);
            var song_found = false;
            console.log("\n=========== LEVEL 1\n Database = ", database);
            for (var i = 0; i <= database[artist_name].length; i++)
            {
                console.log("\nSong: " + database[artist_name][i].song + " by " + artist_name);
                if (database[artist_name][i].song == song_name)
                {
                    song_found = true;
                    console.log("\n\tChosen Song: " + database[artist_name][i].song + "\n\tLink: " + database[artist_name][i].file_link);
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function()
                    {
                        if (this.readyState == 4 && this.status == 200)
                        {
                            console.log("\nOnto Initializations Now!")
                            //Initializations
                            document.getElementById("youtube_video").src = database[artist_name][i].youtube_link;
                            var timer = new Timer();
                            timer.start();

                            //Display Timer
                            timer.addEventListener('secondsUpdated', function (e) {
                                document.getElementById("timer").innerHTML = timer.getTimeValues().toString();
                            });
                        }
                    };
                    xhr.open("GET", database[artist_name][i].file_link, true);
                    xhr.send();
                }
            }
            if (song_found == false)
            {
                document.getElementById("display_chord").innerHTML = "Song not Found!";
            }
        }
    };
    xhttp.open("GET", database_link, true);
    xhttp.send();
}
    /*//Testing
    var all_lines = file_object.split("\n");
    for (var current_line in all_lines)
    {
        current_line = current_line.toString().split(":");
        var hours = parseInt(current_line[0]);
        var minutes = parseInt(current_line[1]);
        var seconds = parseInt(current_line[2]);
        var chord = current_line[3];

        if (hours == timer.getTimeValues().hours)
        {
            if (hours == timer.getTimeValues().minutes)
            {
                if (hours == timer.getTimeValues().seconds)
                {
                    document.getElementById("display_chord").innerHTML = chord;
                }
            }
        }
    }*/

run_this_random("Dilnawaaz", "Local Train")
