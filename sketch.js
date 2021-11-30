// Here some varibles are declared as cosntants


let NO_OF_SQUARES = 10;  // total number of15quares (can take the number between 0 and very large any number, anything larger than 23 looks uselessly crowded)

let BACKGROUND_IMAGE = 'assets/background.png';
let SQUARE_IMAGES = ['assets/blue1.png',
                     'assets/green1.png',
                     'assets/pink1.png',
                     'assets/red1.png',
                     'assets/orange1.png',
                     'assets/blue3.png',
                     'assets/yellow2.png',
                     'assets/gray4.png',
                     'assets/green2.png',
                     'assets/red2.png',
                     'assets/blue2.png',
                     'assets/gray1.png',
                     'assets/gray2.png',
                     'assets/gray3.png'];


let SCREEN_MARGIN = 50;  // margin between the screen boundaries and components

let SQUARE_WIDTH = 64;    // width of each square

// no need to change these settings, these are defined for animations
let PROXIMITY_WIDTH = 8;
let VELOCITY_FRACTION = 3.5;
let SPRING_RATE = 0.1;

// array of square items
let squares = [];

// these are calculated and defined by the program itself
let square_pos = [];      // positions of squares
let square_clicked = -1;  // current clicked square  

let background;      // background image instance
let images = [];          // square instances

class Square {
  constructor(posx, posy, image_idx) {
    // current position of square
    this.posx = posx;
    this.posy = posy;
    
    // where the square should be positioned if not moved
    this.basex = posx;
    this.basey = posy;
    
    
    this.mposx = 0;
    this.mposy = 0;
    
    // positon and variables for spring movement
    this.spring = false;
    this.springx = posx;
    this.springy = posy;
    
    // velocity vector
    this.velx = 0;
    this.vely = 0;
    
    this.width = SQUARE_WIDTH;    // width of square
    
    this.img_idx = image_idx; // stores the index of image instance 
    
    this.draw();              // draws the initial state
  }
  
  
  // draws the current frame
  draw() {
    // if square is moving, continue movement process
    if (this.is_moving()) {
      this.move_to_base();
    }
    
    // draw current state
    if (images.length > 0)
      image(images[this.img_idx], this.posx, this.posy, this.width, this.width);
  }
  
  
  // returns true if mouse is in square area, false otherwise
  mouse_in_square() {    
    return this.mouse_in_vertical() && this.mouse_in_horizontal();
  }
  
  
  // returns true if mouse is in vertical space of square, false otherwise
  mouse_in_vertical() {
    return (this.basey <= mouseY) && (mouseY <= (this.basey + this.width));
  }
  
  
  // returns true if mouse is in horizontal space of square, false otherwise
  mouse_in_horizontal() {
    return (this.basex <= mouseX) && (mouseX <= (this.basex + this.width));
  }
  
  
  set_pos_in_square() {
    this.mposx = mouseX - this.width/2 - this.posx;
    this.mposy = mouseY - this.width/2 - this.posy;
    
  }
  
  
  reset_pos_in_square () {
    this.mposx = 0;
    this.mposy = 0;
  }
  
  
  // returns true if square is moving, false otherwise
  is_moving() {
    if (this.velx == 0 && this.vely == 0) {
      return false;
    }
    return true;
  }
  
  
  // moves the square one frame into desired location
  move_to_base() {
    if (this.velx == 0 && this.vely == 0)
      this.calculate_spring_pos();
    
    // if spring animation is not done do that, otherwise move to base location
    if ( this.spring) {
      // calculate velocity to spring lcoation
      this.velx = (this.springx - this.posx) / VELOCITY_FRACTION;
      this.vely = (this.springy - this.posy) / VELOCITY_FRACTION;
      
      // if came really close stop spring animation
      if ( this.near_spring()) {
        this.spring = false;
      }
    }
    else {
      // calculate velocity to base location
      this.velx = (this.basex - this.posx) / VELOCITY_FRACTION;
      this.vely = (this.basey - this.posy) / VELOCITY_FRACTION;
      
      // in close to base location
      if ( this.near_base()) {
        // reset the velocity
        this.velx = 0;
        this.vely = 0;
        
        this.posx = this.basex;
        this.posy = this.basey;
      }
    }
    
    // move the square
    this.posx = this.posx + this.velx;
    this.posy = this.posy + this.vely;
  }
  
  
  
  // returns whether the square is curently near the base location or not
  near_base() {
    let near_x = -PROXIMITY_WIDTH < this.posx - this.basex && this.posx - this.basex < PROXIMITY_WIDTH;
    let near_y = -PROXIMITY_WIDTH < this.posy - this.basey && this.posy - this.basey < PROXIMITY_WIDTH;
    
    return near_x && near_y;
  }
  
  
  // returns whether the square is curently near the spring location or not
  near_spring() {
    let near_x = -PROXIMITY_WIDTH < this.posx - this.springx && this.posx - this.springx < PROXIMITY_WIDTH;
    let near_y = -PROXIMITY_WIDTH < this.posy - this.springy && this.posy - this.springy < PROXIMITY_WIDTH;
    
    return near_x && near_y;
  }
  
  
  // calculates the spring location from where the square is released usiong related constant values
  calculate_spring_pos() {
    this.spring = true;
    
    this.springx = this.basex - (this.posx - this.basex) * SPRING_RATE;
    this.springy = this.basey - (this.posy - this.basey) * SPRING_RATE;
  }
  
  
  
  // setter function for current position of square
  set_position(posx, posy) {
    this.posx = posx - this.mposx - this.width/2;
    this.posy = posy - this.mposy - this.width/2;
  }
  
  
  
  
  // sets the current location of square
  set_base(posx, posy, current_one) {
    this.basex = posx;
    this.basey = posy;
    
    if (!current_one)
      this.move_to_base();
  }
  
  
  // swaps base locations of two squares
  swap_bases( other_square) {
    let tempx = other_square.basex;
    let tempy = other_square.basey;
    
    other_square.set_base(this.basex, this.basey, false);
    //other_square.calculate_spring_pos();
    //other_square.move_to_base();
    
    this.set_base(tempx, tempy, true);
  }
}


// clears the square pos array
function clear_square_positions() {
  squares = [];
}

// initializes the initial square locations in regards to the screen dimentions
function init_square_positions() {
  clear_square_positions();  
  
  let available_width = windowWidth - 2 * SCREEN_MARGIN;
  
  let margin = (available_width - SQUARE_WIDTH);
  margin = margin / (NO_OF_SQUARES - 1);
  margin = margin - SQUARE_WIDTH;
  
  
  let currentX = SCREEN_MARGIN;
  let currentY = (windowHeight - SQUARE_WIDTH) / 2;

  for ( let i = 0; i < NO_OF_SQUARES; ++i) {
    let image_idx = i;
    if (image_idx >= images.length) {
      image_idx = Math.floor(Math.random() * images.length);
    }
    squares.push( new Square(currentX, currentY, image_idx));
    
    currentX = currentX + margin + SQUARE_WIDTH;
  }
}


function insert_randomly(array, element) {
  let idx = Math.random() * array.length;
  
  array.splice(idx, 0, element);
}

// initialized the assets for squares and the background
function init_images() {
  background = loadImage(BACKGROUND_IMAGE);
  
  for ( let i = 1; i < SQUARE_IMAGES.length; ++i)
    insert_randomly( images, loadImage(SQUARE_IMAGES[i]));
}


// initialized the general panel
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  init_images();
  init_square_positions();

}


// draws the background and also the squares, updated each frame
function draw() {  
  //frameRate(500);
  image(background, 0, 0, width, height);

  for (let i = 0; i < NO_OF_SQUARES; ++i) {
    squares[i].draw();
  }
}


// swaps two squares
function swap_squares(clicked, other) {
  squares[clicked].swap_bases(squares[other]);
  
  let temp_sq = squares[clicked];
  squares[clicked] = squares[other];
  squares[other] = temp_sq;
  
  square_clicked = other;
}


// checks which square is clicked in each mouse button pressed. Changes the square_clicked value into that index. In none pressed, the value is equal to -1
function mousePressed() {  
  for (let i = 0; i < NO_OF_SQUARES; ++i) {
    if ( squares[i].mouse_in_square()) {
      square_clicked = i;
      
      squares[square_clicked].set_pos_in_square();
      
      break;
    }
  }
}


// executes when the mouse button is released. Calculates the spring motion of selected square and starts the movement.
function mouseReleased() {
  // stop moving the square
  if (square_clicked >= 0) {
    squares[square_clicked].move_to_base();
    
    squares[square_clicked].reset_pos_in_square();

    square_clicked = -1;
  }
}


// if any square is selected, moves the current square. Otherwise, does nothing.
function mouseDragged() {
  if (square_clicked >= 0 ) {
    for ( let i = 0; i < NO_OF_SQUARES; ++i) {
      // moves the selected square in the screen
      if ( i == square_clicked) {
        squares[i].set_position(mouseX, mouseY);
      }
      else {
        // if current square moves into the area of an another square, these two and all other squares in between them moves into desired positions
        if ( squares[i].mouse_in_horizontal()) {
          if (square_clicked < i) {
            for (let j = square_clicked; j < i; ++j) {
              swap_squares(j, j+1);
            }
          }
          else {
            for (let j = square_clicked; j > i; --j) {
              swap_squares(j, j-1);
            }
          }
        }
      }
    }
  }
}


// moves to squares into desired positions when the screen is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  init_square_positions();
}