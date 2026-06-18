import {
    Component
} from '@angular/core';

@Component({
    selector: 'app-lookup-server-filter',

    standalone: true,

    template: ''
})
export class LookupServerFilterComponent
{
    private value: string = '';
    private params: any;

    agInit(params: any): void
    {
        this.params = params;
    }

    isFilterActive(): boolean
    {
        return this.value !== '';
    }

    doesFilterPass(): boolean
    {
        return true;
    }

    getModel(): any
    {
        if (!this.value)
        {
            return null;
        }

        return {
            value: this.value
        };
    }

    setModel(model: any): void
    {
        this.value =
            model?.value || '';
    }

    onFloatingFilterChanged(
        type: string,
        value: string
    ): void
    {
        this.value = value;
        this.params.filterChangedCallback();
    }
}