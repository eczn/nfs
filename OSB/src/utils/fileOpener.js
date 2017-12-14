// fileOpener.js 
import Finder from '../Finder'; 
import TextEdit from '../components/TextEdit'; 



export default function(nfsShell, file, fullPath){
    let { filename, ext } = file; 
    let finder = Finder.$(); 

    finder.create({
        type: 'modal', 
        component: TextEdit,
        title: filename + '.' + ext,
        vbind: {
            nfsShell: nfsShell, 
            file: file, 
            file_path: fullPath
        }
    }).launch(); 
}