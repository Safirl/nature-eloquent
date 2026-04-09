// // https://codepen.io/javascriptacademy-stash/pen/porpeoJ

// export default class BookCanvas {
//   declare canvas: HTMLCanvasElement;
//   declare bookInterface: HTMLElement;
//   declare closeBookInterface: HTMLElement;
//   declare ctx: CanvasRenderingContext2D;
//   declare isPainting: boolean;
//   declare lineWidth: number;
//   declare startX: number;
//   declare startY: number;
//   declare isOpen: boolean;
//   declare toolbar: HTMLElement;

//   constructor(width = 800, height = 550) {
//     // Get DOM elements
//     const canvas = document.getElementById("draw-canvas") as HTMLCanvasElement;
//     const closeBookInterface = document.getElementById("close-book");
//     const bookInterface = document.getElementById("book-interface");

//     if (!canvas) {
//       console.error(`No canvas found with id draw-canvas`);
//       return;
//     }

//     this.canvas = canvas as HTMLCanvasElement;
//     this.bookInterface = bookInterface as HTMLElement;
//     this.closeBookInterface = closeBookInterface as HTMLElement;
//     this.toolbar = document.getElementById("toolbar") as HTMLElement;

//     // Ctx & Canvas setup
//     this.setupBookCanvas(width, height);
//     this.setupContextCanvas();

//     // Book event setup
//     this.isOpen = false;
//     this.onToggleBook();
//     this.bindCloseEventBook();
//     this.bindDrawingEvents();
//   }

//   setupBookCanvas(width: number, height: number): void {
//     this.canvas.width = width;
//     this.canvas.height = height;
//     this.canvas.style.borderRadius = "10px";
//   }

//   setupContextCanvas(): void {
//     this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
//     this.isPainting = false;
//     this.lineWidth = 5;
//     this.ctx.fillStyle = "white";
//     this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
//   }

//   bindCloseEventBook(): void {
//     this.closeBookInterface.addEventListener("click", () => {
//       this.isOpen = false;
//       //   this.onToggleBook();
//       this.toggleBook();
//     });
//   }

//   bindDrawingEvents(): void {
//     this.canvas.addEventListener("mousedown", (e) => {
//       this.isPainting = true;
//       this.ctx.beginPath();
//       this.ctx.moveTo(e.offsetX, e.offsetY);
//     });

//     this.canvas.addEventListener("mouseup", () => {
//       this.isPainting = false;
//     });

//     this.canvas.addEventListener("mousemove", (e) => {
//       if (!this.isPainting) return;
//       this.draw(e.offsetX, e.offsetY);
//     });
//   }

//   draw(x: number, y: number): void {
//     this.ctx.lineWidth = this.lineWidth;
//     this.ctx.lineCap = "round";
//     this.ctx.lineTo(x, y);
//     this.ctx.stroke();
//   }

//   toggleBook(): void {
//     this.isOpen = !this.isOpen;
//   }

//   onToggleBook(): void {
//     this.bookInterface.style.display = this.isOpen ? "none" : "flex";
//     if (!this.isOpen) {
//       document.exitPointerLock();
//     } else {
//       document.body.requestPointerLock();
//     }
//   }
// }
