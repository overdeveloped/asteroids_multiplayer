class SpacialHashGrid
{
    constructor(bounds, dimentions)
    {
        this._bounds = bounds;
        this._dimentions = dimentions;
        this._cells = new Map();
    }

    NewClient(position, dimentions)
    {
        const client =
        {
            position: position,
            dimentions: dimentions,
            indices: null
        }

        this._InsertClient(client);

        return client;
    }

    _InsertClient(client)
    {
        const [x, y] = client.position;
        const [width, height] = client.dimentions;

        // min and max
        const index1 = this._GetCellIndex([x - width / 2, y - height / 2]);
        const index2 = this._GetCellIndex([x + width / 2, y + height / 2]);

        // This is a range
        client.indices = [index1, index2];

        for (let x = index1[0], xn = index2[0]; x <= xn; x++)
        {
            for (let y = index1[1], yn = index2[1]; y <= yn; y++)
            {
                const key = this._Key(x, y);

                if (!(key in this._cells))
                {
                    this._cells[key] = new Set();
                }

                this._cells[key].add(client);
            }
        }
    }

    _Key(x, y)
    {
        return x + "." + y;
    }

    _GetCellIndex(position)
    {
        const x = maths.sat((position[0] - this._bounds[0]) /
            (this._bounds[1][0] - this._bounds[0][0]));
        
        const y = maths.sat((position[1] - this._bounds[1]) /
            (this._bounds[1][1] - this._bounds[0][1]));

        const xIndex = Math.floor(x * (this._dimentions[0] - 1));
        const yIndex = Math.floor(x * (this._dimentions[1] - 1));
        
        return [xIndex, yIndex];
    }

    UpdatePosition(client)
    {
        this.RemoveClient(client);
        this._InsertClient(client);
    }

    FindNearby(position, bounds)
    {
        const [x, y] = position;
        const [width, height] = bounds;

        const index1 = this._GetCellIndex([x - width / 2, y - height / 2]);
        const index2 = this._GetCellIndex([x + width / 2, y + height / 2]);

        const clients = new Set();

        for (let x = index1[0], xn = index2[0]; x <= xn; x++)
        {
            for (let y = index1[1], yn = index2[1]; y <= yn; y++)
            {
                const key = this._Key(x, y);

                if (key in this._cells)
                {
                    for (let v of this._cells[key])
                    {
                        clients.add(v);
                    }
                }
            }
        }

        return clients;
    }

    RemoveClient(client)
    {
        for (let x = index1[0], xn = index2[0]; x <= xn; x++)
        {
            for (let y = index1[1], yn = index2[1]; y <= yn; y++)
            {
                const key = this._Key(x, y);

                this._cells[key].delete(client);
            }
        }
    }

    Draw()
    {
        console.log(this._cells);

        // for (let x = index1[0], xn = index2[0]; x <= xn; x++)
        // {
        //     for (let y = index1[1], yn = index2[1]; y <= yn; y++)
        //     {
        //         const key = this._Key(x, y);
        //     }
        // }

    }

}