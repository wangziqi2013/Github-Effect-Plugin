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

// The number of missing grids on the first column of
// the commit record
var offset_adjustment = 0;

// This is the global array of commit records in the calendar
var commit_list = document.getElementsByClassName("day");

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

var F_bitmap = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
];

var G_bitmap = [
  [0, 0, 1, 1, 1, 1, 1],
  [0, 1, 1, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 1, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [0, 1, 1, 0, 0, 1, 1],
  [0, 0, 1, 1, 1, 1, 1],
];

var H_bitmap = [
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1],
];

var I_bitmap = [
  [1, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [0, 0, 1, 1, 0, 0],
  [1, 1, 1, 1, 1, 1],
];

/*
 * get_offset_adjustment() - Get the adjustment for starting
 *                           array index of commit records
 *
 * Since this will change for different days in a week, we need
 * to use the number of grids in the first column to determine
 * the offset
 */
function get_offset_adjustment()
{ 
  var commit_record = document.getElementsByClassName("js-calendar-graph-svg");
  
  if(commit_record.length != 1)
  {
    alert("ERROR: Could not find commit record!");
    
    return;
  }
  
  // Get the first elememnt from the list
  commit_record = commit_record[0];
  
  if(commit_record.children.length < 1)
  {
    alert("ERROR: Could not find commit record in childNode");
    
    return;
  }
  
  commit_record = commit_record.children[0];
  
  if(commit_record.children.length < 1)
  {
    alert("ERROR: Could not find commit record in child's childNode");
    
    return;
  }
  
  var first_col = commit_record.children[0];
  
  // If there are 7 records then adjustment is effectively 0
  offset_adjustment = 7 - first_col.children.length;
  
  return;
}

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
    // Need to consider the number of missing
    // records in the first column
    offset -= offset_adjustment;
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
  var rect_list = document.getElementsByClassName("day");
  
  for(var i = 0;i < rect_list.length;i++)
  {
    rect_obj = rect_list[i];
    
    rect_obj.setAttribute("fill", "#1e6823");
    rect_obj.setAttribute("data-count", "100");
  }
  
  return;
}

// This must be called first before any drawing
get_offset_adjustment();
clear_all(commit_list);

var next_col = 20;

next_col = draw_bitmap(commit_list,
                       H_bitmap, 
                       "#FFFF00",
                       next_col);

next_col = draw_bitmap(document.getElementsByClassName("day"),
                       I_bitmap, 
                       "#FF00FF",
                       next_col + 1);


