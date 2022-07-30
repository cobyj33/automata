import { IKernelRunShortcut } from 'gpu.js';
import { Metadata } from './Metadata';


export interface Automata {
    getMetadata(): Metadata;    
    getKernel(): IKernelRunShortcut
}
