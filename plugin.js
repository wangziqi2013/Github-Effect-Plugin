// ==UserScript==
// @name        github-fake-commit
// @namespace   675973885@qq.com
// @match     https://github.com/*
// @version     1
// @grant       none
// ==/UserScript==

// The interval between characters is 1 column by default
var char_interval = 1;

// The color we use as background color
var default_color = "#EEEEEE";

var A_bitmap = [
  [0, 0, 1, 1, 1, 0, 0],
  [0, 1, 1, 0, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
];

var B_bitmap = [
  [1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 0],
];

var C_bitmap = [
  [0, 0, 1, 1, 1, 1, 0],
  [0, 1, 1, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [0, 1, 1, 0, 0, 1, 1],
  [0, 0, 1, 1, 1, 1, 0],
];

var D_bitmap = [
  [1, 1, 1, 1, 1, 0, 0],
  [1, 1, 0, 0, 1, 1, 0],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 0, 0],
];

var E_bitmap = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1],
];

/*
 * pos_to_offset() - Convert row-col position to offset in the array
 *
 * If the position does not exist in the array, we just return -1
 * to notify the caller do not use this row-col position
 */
function pos_to_offset(array, row, col)
{
  var offset = col * 7 + row;
  
  if(offset <= 0)
  {
    return -1;
  } 
  else
  {
    offset -= 1;
  }
  
  if(offset >= array.length)  
  {
    return -1;
  }
  
  return offset;
}

/*
 * clear_all() - Clear the background color to the default
 *
 * Default color is defined as a global variable
 */
function clear_all(array)
{
  for(var i = 0;i < array.length;i++)
  {
    array[i].setAttribute("fill", default_color);
  }
  
  return;
}

/*
 * draw_bitmap() - Draw the given 7 * 7 bitmap 
 *
 * The return value is the next column to draw 
 * And if the bitmap is empty we just return start column trivially
 */
function draw_bitmap(array,
                     bitmap, 
                     color, 
                     start_col)
{
  var row_num = bitmap.length;
  if(row_num == 0) 
  {
    return start_col;   
  }
  
  var col_num = bitmap[0].length;
  
  for(var row = 0;row < row_num;row++)
  {
    for(var col = 0;col < col_num;col++)
    {
      var real_col = col + start_col;
      
      var offset = pos_to_offset(array, row, real_col);
      if(offset == -1)
      {
        continue;
      }
      
      if(bitmap[row][col] == 0)
      {
        continue;
      }
      
      array[offset].setAttribute("fill", color);
    }
  }
  
  return start_col + col_num;
}

function change_commit_record()
{
  rect_list = document.getElementsByClassName("day");
  
  for(var i = 0;i < rect_list.length;i++)
  {
    rect_obj = rect_list[i];
    
    rect_obj.setAttribute("fill", "#1e6823");
    rect_obj.setAttribute("data-count", "100");
  }
  
  return;
}

//change_commit_record();

clear_all(document.getElementsByClassName("day"));
draw_bitmap(document.getElementsByClassName("day"),
            E_bitmap, 
            "#FF0000",
            20);


