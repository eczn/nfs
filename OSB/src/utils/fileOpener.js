// fileOpener.js 
import Finder from '../Finder'; 
import TextEdit from '../components/TextEdit'; 
import Eyeser from '../components/Eyeser'; 
import Cli from '../components/Cli'; 


let componentTable = {
    'txt': TextEdit,
    'png': Eyeser,
    'jpg': Eyeser, 
}


function open(nfsShell, file, fullPath){
    let { filename, ext } = file; 
    let finder = Finder.$(); 
    
    finder.create({
        type: 'modal', 
        component: componentTable[ext],
        title: filename + '.' + ext,
        vbind: {
            nfsShell: nfsShell, 
            file: file, 
            file_path: fullPath
        }
    }).launch(); 
}

open.cli = function(nfsShell){
    Finder.$().create({
        type: 'modal', 
        component: Cli, 
        title: 'nfsShell', 
        vbind: {
            nfsShell
        },
        style: {
            backgroundColor: `rgba(0, 0, 0, .5)`,
            border: 'none',
            color: '#FFF',
            bottom: 0
        }
    }).launch(); 
}

export default open; 