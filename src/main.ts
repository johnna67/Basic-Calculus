import 'katex/dist/katex.min.css';
import './styles.css';
import { App } from './App';

const root=document.getElementById('app');
if(!root)throw new Error('Missing app root.');
new App(root);
