// export default class BookDrawing {
//     declare canvas: HTMLCanvasElement;
//     declare bookInterface: HTMLElement;
//     declare closeBookInterface: HTMLElement;
//     declare ctx: CanvasRenderingContext2D;
//     declare isPainting: boolean;
//     declare lineWidth: number;

//     constructor(width = 800, height = 400) {
//         // Get DOM elements
//         const canvas = document.getElementById("draw-canvas");
//         const closeBookInterface = document.getElementById("close-book-interface");
//         const bookInterface = document.getElementById("book-interface");

//         if (!canvas) {
//             console.error(`No canvas found with id ${canvas}`);
//             return;
//         }

//         this.canvas = canvas as HTMLCanvasElement;
//         this.bookInterface = bookInterface as HTMLElement;
//         this.closeBookInterface = closeBookInterface as HTMLElement;

//         // Ctx & Canvas setup
//         this.setupBookCanvas(width, height);
//         this.setupContextCanvas();

//         // Book event setup
//         this.bindDrawingEvents();
//     }

//     setupBookCanvas(width: number, height: number): void {
//         this.canvas.width = width;
//         this.canvas.height = height;
//         this.canvas.style.borderRadius = "10px";
//     }

//     setupContextCanvas(): void {
//         this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
//         this.isPainting = false;
//         this.lineWidth = 5;
//         this.ctx.fillStyle = "white";
//         this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
//     }

//     bindDrawingEvents(): void {
//         this.canvas.addEventListener("mousedown", (e) => {
//             this.isPainting = true;
//             this.ctx.beginPath();
//             this.ctx.moveTo(e.offsetX, e.offsetY);
//         });

//         this.canvas.addEventListener("mouseup", () => {
//             this.isPainting = false;
//         });

//         this.canvas.addEventListener("mousemove", (e) => {
//             if (!this.isPainting) return;
//             this.draw(e.offsetX, e.offsetY);
//         });
//     }

//     draw(x: number, y: number): void {
//         this.ctx.lineWidth = this.lineWidth;
//         this.ctx.lineCap = "round";
//         this.ctx.lineTo(x, y);
//         this.ctx.stroke();
//     }

// }