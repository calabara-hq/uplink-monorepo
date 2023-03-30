declare module "@editorjs/paragraph" {
    import { BlockTool, BlockToolConstructorOptions } from "@editorjs/editorjs";

    class Paragraph implements BlockTool {
        constructor(config?: BlockToolConstructorOptions);

        render(): HTMLElement;
        save(blockContent: HTMLElement): object;
    }

    export default Paragraph;
}

declare module "@editorjs/list" {
    import { BlockTool, BlockToolConstructorOptions } from "@editorjs/editorjs";

    class List implements BlockTool {
        constructor(config?: BlockToolConstructorOptions);

        render(): HTMLElement;
        save(blockContent: HTMLElement): object;
    }

    export default List;
}