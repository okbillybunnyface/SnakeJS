(function breakout()
{
	console.log("Program started");

	var height = 15;
	var width = 15;

	document.addEventListener("keydown", keydown, false);

	var c = document.getElementById("gameView");
	var gameView = c.getContext("2d");

	var delay = 0;
	var direction = "Up";

	if(typeof Object.create !== "function")
	{
		Object.create = function(o)
		{
			var F = function(){};
			F.prototype = o;
			return new F();
		}
	}

	var transform = 
	{
		x: undefined,
		y: undefined
	};

	var tail = Object.create(transform)
	tail.next = undefined;
	tail.prev = undefined;

	var head = Object.create(tail);

	var food = Object.create(transform);

	gameStart();

	animate();

	function animate()
	{
		if(delay > 25)
		{
			delay = 0;
			update();
		}
		delay++;
		requestAnimationFrame(animate);
	};

	function update()
	{
		//Find tail and paint over it
		var current = head;
		while(current.next !== undefined)
		{
			current = current.next;
		}

		move(direction);
		gameView.fillStyle="#555555";
		gameView.fillRect(0, 0, 768, 768);
		var current = head;
		while(current.next !== undefined)
		{
			current = current.next;
			gameView.fillStyle="#FFFFFF";
			gameView.fillRect(current.x * 768/width - 1, current.y * 768/height - 1, 768/width + 2, 768/height + 2);
		}
		gameView.fillStyle="#FFFFFF";
		gameView.fillRect(head.x * 768/width-1, head.y * 768/height-1, 768/width+2, 768/height+2);
		gameView.fillStyle="#00FF00";
		gameView.fillRect(food.x * 768/width, food.y * 768/height, 768/width, 768/height);

		if(head.x < 0 || head.x >= width || head.y < 0 || head.y >= height)
		{
			gameStart();
		}
		var current = head;
		while(current.next !== undefined)
		{
			current = current.next;
			if(head.x === current.x && head.y === current.y)
			{
				gameStart();
			}
		}
	};

	function move(dir)
	{
		if(getNext(dir).x === food.x && getNext(dir).y === food.y)
		{
			eat();
		}
		else
		{
			var current = head;
			while(current.next !== undefined)
			{
				current = current.next;
			}

			if(current !== head)current.prev.next = undefined;
		}
		insertTail();
		head.x = Math.floor(getNext(dir).x);
		head.y = Math.floor(getNext(dir).y);
	}

	function insertTail()
	{
		var temp = Object.create(tail);
		temp.x = Math.floor(head.x);
		temp.y = Math.floor(head.y);
		if(typeof head.next === 'undefined')
		{
			head.next = temp;
			temp.prev = head;
		}
		else
		{
			temp.next = head.next;
			temp.prev = head;
			head.next.prev = temp;
			head.next = temp;
		}
	}

	function eat()
	{
		spawnFood();
	}

	function getNext(dir)
	{
		switch(dir)
		{
			case "Up":
				var out = 
				{
					x: head.x,
					y: head.y
				}
				out.y -= 1;
				return out;
			case "Down":
				var out = 
				{
					x: head.x,
					y: head.y
				}
				out.y += 1;
				return out;
			case "Left":
				var out = 
				{
					x: head.x,
					y: head.y
				}
				out.x -= 1;
				return out;
			case "Right":
				var out = 
				{
					x: head.x,
					y: head.y
				}
				out.x += 1;
				return out;
		}
	}

	function gameStart()
	{
		head.next = undefined;
		direction = "Up";
		head.x = Math.floor(width / 2);
		head.y = Math.floor(height / 2);
		spawnFood();
	}

	function spawnFood()
	{
		food.x = Math.floor(Math.random() * width);
		food.y = Math.floor(Math.random() * height);

		var length = 1;

		if(head.x === food.x && head.y === food.y)
		{
			return spawnFood();
		}
		else
		{
			var current = head;
			while(current.next !== undefined)
			{
				current = current.next;
				length++;
				if(food.x == current.x && food.y == current.y)
				{
					return spawnFood();
				}
			}
		}

		console.log(length);
	}

	function keydown(event)
	{
		switch(event.keyCode)
		{
			case 65:
				if(direction !== "Right")direction = "Left";
				break;
			case 68:
				if(direction !== "Left")direction = "Right";
				break;
			case 87:
				if(direction !== "Down")direction = "Up";
				break;
			case 83:
				if(direction !== "Up")direction = "Down";
				break;
		}
	};
}());