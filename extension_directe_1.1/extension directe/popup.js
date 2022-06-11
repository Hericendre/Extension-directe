function moyennes(){
    function get_note(note){
        note=note.textContent.replace(/,/g,".").replace(/\s/g,'')
        if (note=="Abs"){
            return null
        }
        if (note.match(/^\(.+\)$/)) return null
        let match = note.match(/(.+)(\(.+\))/)
        let coeff=match ? Number(match[2].replace(/\(|\)/g, "")):1
        note = match ? match[1] : note
        match=note.match(/(.+)\/(.+)/)
        note=match?20*Number(match[1])/Number(match[2]):Number(note)
        return [note,coeff]
    }
    function get_notes(notes){
        let valeur_notes=[]
        for (let note of notes.children){
            let valeur=get_note(note)
            if (valeur) valeur_notes.push(valeur)
        }
        return valeur_notes
    }
    
    function moyenne_pond(liste){
        let s = 0
        let n=0
        for (let elt of liste){
            s+=elt[0]*elt[1]
            n+=elt[1]
        }
        return s/n
    }
    let toutes_notes=[]
    let table=document.querySelector(".table.releve.ed-table").children[1]
    let valeurs={}
    for (let row of table.children){
        if (!row.className.includes("secondary")){
            if (row.className.includes("master")){
                let notes1=row.nextElementSibling.querySelector(".notes")
                let notes2=row.nextElementSibling.nextElementSibling.querySelector(".notes")
                let moyenne=moyenne_pond(get_notes(notes1).concat(get_notes(notes2)))
                valeurs[row.querySelector("span.nommatiere").textContent]=moyenne
                toutes_notes.push([moyenne,1])
            }
            else{
                let a = row.querySelector(".notes")
                let b = get_notes(a)
                let moyenne=moyenne_pond(get_notes(row.querySelector(".notes")))
                valeurs[row.querySelector("span.nommatiere").textContent]=moyenne
                toutes_notes.push([moyenne,1])
                
            }
        }
    }
    let dialog=document.createElement("dialog")
    let tab=document.createElement("table")
    dialog.appendChild(tab)
    valeurs["MOYENNE GENERALE"]=moyenne_pond(toutes_notes)
    for(let mat of Object.keys(valeurs)){
        let cont=document.createElement("tr")
        let matiere=document.createElement("td")
        let note=document.createElement("td")
        matiere.textContent=mat
        if (mat == "MOYENNE GENERALE") matiere.style.fontWeight="bold"
        note.textContent=Number(valeurs[mat].toFixed(3))
        cont.appendChild(matiere)
        cont.appendChild(note)
        tab.appendChild(cont)
    }
    let button2= document.createElement("button")
    button2.onclick=()=>dialog.close()
    button2.textContent="retour"
    dialog.appendChild(button2)
    document.body.append(dialog)
    dialog.style.padding="1em"
    dialog.showModal()
}

(async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: moyennes,
    });
  })()
