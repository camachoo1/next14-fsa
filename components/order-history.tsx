/*


        {orders.map((order) => (
          <div key={order.id} className='mb-4 p-4 shadow-lg'>
            <div className='flex justify-between items-center mb-4'>
              <div>
                <p className='uppercase'>Total</p>
                <p>{order.total}</p>
              </div>
              <div>
                <p>Order Placed</p>
                <p>{order.date}</p>
              </div>
              <div>
                <p>Order#</p>
                <p>{ order.id}</p>
              </div>
              <div className='flex items-center'>
                <div>
                  <p>{ order.details.name}</p>
                  <p>Color: { order.details.color}</p>
                  <p>Size: { order.details.size}</p>
                  <p>Quantity: { order.details.quantity}</p>
                </div>
                <div className='ml-auto'>
                  <p>{order.details.price}</p>
                </div>
              </div>
            </div>
          </div>
        ))}


*/