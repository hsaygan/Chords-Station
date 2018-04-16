var database_link = "https://hsaygan.github.io/Chords-Station/database.json";

function run_this_random(song_name, artist_name)
{
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            var database = JSON.parse(xhttp.responseText);
            console.log("\n=========== LEVEL 1\n Database = ", database);
            for (var file_manifest in database)
            {
                console.log("\n", file_manifest, "\nSong: " + database.file_manifest[0].song + " by " + database.file_manifest[0].artist);
                if (artist_name == file_manifest)
                {
                    console.log("\nCHAL GYA!!!")
                    if (song_name == database.file_manifest.song)
                    {
                        console.log(file_manifest);
                        var xhr = new XMLHttpRequest();
                        xhttp.onreadystatechange = function()
                        {
                            if (this.readyState == 4 && this.status == 200)
                            {
                                var file_object = xhr.responseText;
                                console.log("\=========== LEVEL 2\n File Object: ", file_object);


                                //Initializations
                                document.getElementById("youtube_video").src = file_manifest.youtube_link;
                                var timer = new Timer();
                                timer.start();

                                //Display Timer
                                timer.addEventListener('secondsUpdated', function (e) {
                                    document.getElementById("timer").innerHTML = timer.getTimeValues().toString();
                                });
                            }
                        };
                        xhttp.open("GET", file_manifest.link, true);
                        xhttp.send();
                    }
                }
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
