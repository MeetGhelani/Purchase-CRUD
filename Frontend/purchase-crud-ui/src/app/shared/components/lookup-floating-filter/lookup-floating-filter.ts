import {
    Component
} from '@angular/core';

import {
    FormsModule
} from '@angular/forms';

@Component({
    selector: 'app-lookup-floating-filter',

    standalone: true,

    imports: [
        FormsModule
    ],

    templateUrl:
        './lookup-floating-filter.html',

    styleUrls:
        ['./lookup-floating-filter.css']
})
export class LookupFloatingFilterComponent
{
    value: string = '';

    params: any;

    agInit(params: any): void
    {
        this.params = params;
    }

    onInput(): void
    {

        const trimmedValue =
        this.value.trim();

        this.params.parentFilterInstance(
            (instance: any) =>
            {
                instance.onFloatingFilterChanged(
                    'contains',
                    trimmedValue
                );
            }
        );
    }
}