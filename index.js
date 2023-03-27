var puppeteer = require("puppeteer");

async function extractdata(){

    var browser = await puppeteer.launch({headless:false});

    var page = await browser.newPage();

    await page.goto("https://www.github.com/trending");

    await page.waitForSelector(".Box-row");

    var repos = await page.evaluate(function (){
        var repoArr = [];
        var reposElement = Array.from(document.querySelectorAll(".Box-row"));
        reposElement.forEach((repo) =>{

            var titleData = repo.querySelector('h1').innerText;
            titleData.replace(" ","");

            var DescriptionData = "";
            if(repo.querySelector("p"))
            {
                DescriptionData = repo.querySelector("p").innerText;
            };

            var urlData ="";
            var starUrl = "";
            var forksUrl ="";
            if(repo.querySelector("h1> a"))
            {
                urlData = repo.querySelector("h1>a").href;
                starUrl = repo.querySelector("h1>a").getAttribute('href');
                forksUrl = repo.querySelector("h1>a").getAttribute('href');
            }

            starUrl = starUrl + "/stargazers";
            var starData = "";
            // if(repo.querySelector(""))
            starData = repo.querySelector(`a[href = '${starUrl}']`).innerText;

            var forksData ="";

            forksUrl = forksUrl + "/forks";
            forksData = repo.querySelector(`a[href = '${forksUrl}']`).innerText;

            var langData = ""
            if(repo.querySelector("span[itemprop = 'programmingLanguage']"))
            {
                langData = repo.querySelector("span[itemprop = 'programmingLanguage']").innerText;
            }
            repoArr.push({
                title:titleData,
                Description:DescriptionData,
                url:urlData,
                Stars:starData,
                forks:forksData,
                Language:langData
            });

            
        });

    
        return repoArr;
        
    });

    var developerElement = await page.$("a[href ='/trending/developers']");
    await developerElement.click();

    await page.waitForSelector("a[href = '/trending/developers/javascript?since=daily");

    var text = await page.evaluate(()=> {
        return document.querySelector("a[href= '/trending/developers/javascript?since=daily").click();
    });

    console.log("test",text);

    var developers = await page.evaluate(()=>{
        var developersArr = [];
        var developersRows = Array.from(document.querySelectorAll('.Box-row'));
        developersRows.forEach((developer) => {
            var name ="";
            if(developer.querySelector(".h3"))
            {
                name = developer.querySelector(".h3").innerText;
            }

            var repo ="";
            if(developer.querySelector(".h4"))
            {
                repo = developer.querySelector(".h4").innerText;
            }
            // var name = developer.querySelector(".h3").innerText;
            // var repo = developer.querySelector(".h4").innerText;
            var devDescription = "";
            if(developer.querySelectorAll(".f6")[2])
            {
                devDescription = developer.querySelectorAll(".f6")[2].innerText;
            }
            developersArr.push({
                name:name,
                repo:repo,
                Description: devDescription,
            });
        }); 

        return developersArr;

    });
     browser.close();

    console.log("Repositories",repos,"Developers",developers);
}


extractdata();