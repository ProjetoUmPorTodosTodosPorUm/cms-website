export type RowCell = {
    key: string;
    label: string;
    value: any;
    isStatus?: boolean;
    isTag?: boolean;
    isJson?: boolean;
    isLink?: boolean;
    isStatic?: boolean;
    textLimit?: number;
    isModal?: boolean;
    transform?: (value: any) => any
}
