// fileOpener.js 
import Finder from '../Finder'; 
import TextEdit from '../components/TextEdit'; 
import Eyeser from '../components/Eyeser'; 


let componentTable = {
    'txt': TextEdit,
    'png': Eyeser,
    'jpg': Eyeser
}


export default function(nfsShell, file, fullPath){
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